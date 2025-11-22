import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, Inbox, Archive, Plus, Search, Eye, EyeOff, Trash2, Reply, Forward } from 'lucide-react';

const Messaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, received, sent
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    receiverEmail: '',
    receiverRole: '',
    subject: '',
    content: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMessages();
    loadUsers();
  }, [user, navigate]);

  useEffect(() => {
    filterMessages();
  }, [messages, activeTab, searchTerm, user.email, user.role]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3002/messages', {
        headers: {
          'x-user-email': user.email,
          'x-user-role': user.role,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Erreur lors du chargement des messages');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Load students
      const studentsRes = await fetch('http://localhost:3002/etudiants');
      const students = await studentsRes.json();

      // Load teachers
      const teachersRes = await fetch('http://localhost:3002/enseignant');
      const teachers = await teachersRes.json();

      // Load admins
      const adminsRes = await fetch('http://localhost:3001/api/auth/users/administratif', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const admins = await adminsRes.json();

      // Load directors
      const directorsRes = await fetch('http://localhost:3001/api/auth/users/directeur_departement', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const directors = await directorsRes.json();

      const allUsers = [
        ...students.map(s => ({ email: s.email, role: 'etudiant', name: `${s.nom} ${s.prenom}` })),
        ...teachers.map(t => ({ email: t.email, role: 'enseignant', name: `${t.nom} ${t.prenom}` })),
        ...admins.map(a => ({ email: a.email, role: 'administratif', name: `${a.nom} ${a.prenom}` })),
        ...directors.map(d => ({ email: d.email, role: 'directeur_departement', name: `${d.nom} ${d.prenom}` })),
      ];

      setUsers(allUsers);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    }
  };

  const filterMessages = useCallback(() => {
    let filtered = messages;

    if (activeTab === 'received') {
      filtered = messages.filter(m => m.receiverEmail === user.email && m.receiverRole === user.role);
    } else if (activeTab === 'sent') {
      filtered = messages.filter(m => m.senderEmail === user.email && m.senderRole === user.role);
    }

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.receiverEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [messages, activeTab, searchTerm, user.email, user.role]);

  const sendMessage = async () => {
    try {
      const response = await fetch('http://localhost:3002/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
          'x-user-role': user.role,
        },
        body: JSON.stringify(composeData),
      });

      if (response.ok) {
        setShowCompose(false);
        setComposeData({ receiverEmail: '', receiverRole: '', subject: '', content: '' });
        loadMessages();
      } else {
        alert('Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  const forwardMessage = (message) => {
    // Pré-remplir le formulaire de transfert
    setComposeData({
      receiverEmail: '',
      receiverRole: '',
      subject: message.subject.startsWith('Fwd: ') ? message.subject : `Fwd: ${message.subject}`,
      content: `\n\n--- Message transféré ---\nDe: ${message.senderEmail}\nÀ: ${message.receiverEmail}\nSujet: ${message.subject}\nDate: ${formatDate(message.createdAt)}\n\n${message.content}`
    });
    setSelectedMessage(null);
    setShowCompose(true);
  };

  const replyToMessage = (message) => {
    // Pré-remplir le formulaire de réponse avec un espace vide au début pour écrire la réponse
    setComposeData({
      receiverEmail: message.senderEmail,
      receiverRole: message.senderRole,
      subject: message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`,
      content: `\n\n\n--- Message original ---\nDe: ${message.senderEmail}\nSujet: ${message.subject}\nDate: ${formatDate(message.createdAt)}\n\n${message.content}`
    });
    setSelectedMessage(null);
    setShowCompose(true);

    // Focus sur le champ de contenu après un court délai pour permettre au DOM de se mettre à jour
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        // Placer le curseur au début du champ (avant la citation) pour permettre à l'utilisateur d'écrire sa réponse
        textarea.setSelectionRange(0, 0);
      }
    }, 100);
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`http://localhost:3002/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'x-user-email': user.email,
          'x-user-role': user.role,
        },
      });
      loadMessages();
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Messagerie</h1>
              <button
                onClick={() => setShowCompose(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau message
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Tous les messages
                </button>
                <button
                  onClick={() => setActiveTab('received')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'received' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Inbox className="w-4 h-4 inline mr-2" />
                  Reçus
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'sent' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Envoyés
                </button>
              </div>

              {/* Search */}
              <div className="mt-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              {selectedMessage ? (
                /* Message detail */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ← Retour
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => replyToMessage(selectedMessage)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Reply className="w-4 h-4" />
                        Répondre
                      </button>
                      <button
                        onClick={() => forwardMessage(selectedMessage)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Forward className="w-4 h-4" />
                        Transférer
                      </button>
                      <div className="text-sm text-gray-500">
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>De:</strong> {selectedMessage.senderEmail} ({selectedMessage.senderRole})<br />
                      <strong>À:</strong> {selectedMessage.receiverEmail} ({selectedMessage.receiverRole})
                    </div>
                    <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
                  </div>
                </div>
              ) : showCompose ? (
                /* Compose message */
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {composeData.subject.startsWith('Re: ') ? 'Répondre au message' : 
                     composeData.subject.startsWith('Fwd: ') ? 'Transférer le message' : 
                     'Nouveau message'}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Destinataire</label>
                      {composeData.subject.startsWith('Re: ') ? (
                        <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50">
                          {users.find(u => u.email === composeData.receiverEmail && u.role === composeData.receiverRole)?.name || composeData.receiverEmail} ({composeData.receiverEmail}) - {composeData.receiverRole}
                        </div>
                      ) : (
                        <select
                          value={`${composeData.receiverEmail}|${composeData.receiverRole}`}
                          onChange={(e) => {
                            const [email, role] = e.target.value.split('|');
                            setComposeData({ ...composeData, receiverEmail: email, receiverRole: role });
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="">Sélectionner un destinataire</option>
                          {users.map((u, idx) => (
                            <option key={idx} value={`${u.email}|${u.role}`}>
                              {u.name} ({u.email}) - {u.role}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sujet</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        rows={10}
                        value={composeData.content}
                        onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Envoyer
                      </button>
                      <button
                        onClick={() => {
                          setShowCompose(false);
                          setComposeData({ receiverEmail: '', receiverRole: '', subject: '', content: '' });
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Messages list */
                <div className="divide-y divide-gray-200">
                  {filteredMessages.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      Aucun message trouvé
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${!message.isRead ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.isRead && message.receiverEmail === user.email && message.receiverRole === user.role) {
                            markAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className={`text-sm font-medium ${!message.isRead ? 'font-bold' : ''}`}>
                                {message.subject}
                              </h3>
                              {!message.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {message.senderEmail === user.email && message.senderRole === user.role
                                ? `À: ${message.receiverEmail}`
                                : `De: ${message.senderEmail}`}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {message.content.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;