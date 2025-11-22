import React, { useState, useEffect } from 'react';
import { Mail, Send, Search, Star, Trash2, Archive, Clock, Paperclip, X } from 'lucide-react';

const MessagingPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ destinataire: '', sujet: '', contenu: '' });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const messagesData = [
      {
        id: 1,
        expediteur: 'Prof. Fatma Touati',
        sujet: 'Correction TP Programmation Avancée',
        contenu: 'Bonjour,\n\nJe viens de corriger votre TP sur les structures de données. Excellent travail ! Vous avez obtenu 18/20.\n\nContinuez comme ça !\n\nCordialement,\nProf. Touati',
        date: '2024-11-20T14:30:00',
        lu: false,
        important: true,
        categorie: 'academique'
      },
      {
        id: 2,
        expediteur: 'Service Scolarité',
        sujet: 'Relevé de notes Semestre 1',
        contenu: 'Cher étudiant,\n\nVotre relevé de notes du semestre 1 est maintenant disponible dans votre espace personnel.\n\nMoyenne: 14.8/20\n\nPour toute réclamation, merci de nous contacter sous 48h.\n\nService Scolarité',
        date: '2024-11-19T09:15:00',
        lu: true,
        important: false,
        categorie: 'administratif',
        pieceJointe: 'releve_notes_S1.pdf'
      },
      {
        id: 3,
        expediteur: 'Dr. Mohamed Trabelsi',
        sujet: 'Projet Base de Données - Soutenance',
        contenu: 'Bonjour,\n\nVotre soutenance de projet Base de Données est prévue le 25 novembre à 14h00 en salle C102.\n\nMerci de préparer:\n- Présentation PowerPoint (20 min)\n- Démonstration live (10 min)\n- Documentation technique\n\nBonne préparation !\n\nDr. Trabelsi',
        date: '2024-11-18T16:45:00',
        lu: false,
        important: true,
        categorie: 'academique'
      },
      {
        id: 4,
        expediteur: 'Bibliothèque Universitaire',
        sujet: 'Rappel - Livre à rendre',
        contenu: 'Bonjour,\n\nNous vous rappelons que le livre "Algorithmique et Programmation" emprunté le 05/11/2024 doit être rendu avant le 26/11/2024.\n\nMerci de votre compréhension.\n\nBibliothèque',
        date: '2024-11-17T11:00:00',
        lu: true,
        important: false,
        categorie: 'bibliotheque'
      },
      {
        id: 5,
        expediteur: 'Prof. Youssef Mejri',
        sujet: 'Invitation Séminaire IA',
        contenu: 'Cher étudiant,\n\nVous êtes invité à participer au séminaire "Intelligence Artificielle et Applications" qui se tiendra le 30 novembre 2024 à 10h00 dans l\'amphithéâtre principal.\n\nIntervenants:\n- Dr. Sarah Khalil (Google AI)\n- Prof. Karim Mansour (MIT)\n\nInscription obligatoire avant le 28/11.\n\nCordialement,\nProf. Mejri',
        date: '2024-11-16T13:20:00',
        lu: true,
        important: true,
        categorie: 'evenement'
      },
      {
        id: 6,
        expediteur: 'Association des Étudiants',
        sujet: 'Hackathon 2024 - Inscription ouverte',
        contenu: 'Salut,\n\nLe Hackathon annuel de l\'ENIS aura lieu les 15-16 décembre 2024 !\n\nThème: "Solutions innovantes pour l\'environnement"\n\nPrix:\n1er: 5000 TND\n2ème: 3000 TND\n3ème: 1500 TND\n\nInscris-toi vite sur notre site !\n\nL\'équipe AE',
        date: '2024-11-15T10:30:00',
        lu: true,
        important: false,
        categorie: 'evenement'
      },
      {
        id: 7,
        expediteur: 'Service Stage',
        sujet: 'Offres de stage disponibles',
        contenu: 'Bonjour,\n\nDe nouvelles offres de stage sont disponibles:\n\n1. Développeur Full-Stack - TechCorp (Tunis)\n2. Data Scientist - DataLab (Sfax)\n3. Ingénieur DevOps - CloudSys (Sousse)\n\nConsultez les détails sur le portail des stages.\n\nService Stage',
        date: '2024-11-14T14:00:00',
        lu: true,
        important: false,
        categorie: 'stage'
      }
    ];
    
    setMessages(messagesData);
    setLoading(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.destinataire || !newMessage.sujet || !newMessage.contenu) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    alert('Message envoyé avec succès !');
    setShowCompose(false);
    setNewMessage({ destinataire: '', sujet: '', contenu: '' });
  };

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, lu: true } : msg
    ));
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
      setMessages(messages.filter(msg => msg.id !== id));
      setSelectedMessage(null);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesFilter = filter === 'tous' || 
      (filter === 'non_lus' && !msg.lu) ||
      (filter === 'important' && msg.important);
    
    const matchesSearch = msg.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sujet.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(msg => !msg.lu).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la messagerie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-600" />
              Messagerie
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Send className="w-5 h-5" />
            Nouveau message
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Recherche et filtres */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('tous')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filter === 'tous' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilter('non_lus')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filter === 'non_lus' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Non lus
                </button>
                <button
                  onClick={() => setFilter('important')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filter === 'important' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Important
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto max-h-[600px]">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    handleMarkAsRead(message.id);
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  } ${!message.lu ? 'bg-blue-50 bg-opacity-30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!message.lu ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${!message.lu ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'} truncate`}>
                          {message.expediteur}
                        </span>
                        {message.important && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      </div>
                      <p className={`text-sm ${!message.lu ? 'font-semibold' : ''} text-gray-800 truncate mb-1`}>
                        {message.sujet}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(message.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contenu du message */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                {/* Header du message */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedMessage.sujet}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold">De: {selectedMessage.expediteur}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      {selectedMessage.pieceJointe && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                          <Paperclip className="w-4 h-4" />
                          <span>{selectedMessage.pieceJointe}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {selectedMessage.important && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <Star className="w-4 h-4 text-yellow-600 fill-current" />
                      <span className="text-sm font-semibold text-yellow-700">Message important</span>
                    </div>
                  )}
                </div>

                {/* Corps du message */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.contenu}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                    Répondre
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Sélectionnez un message pour le lire</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Nouveau message */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Nouveau message</h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Destinataire</label>
                  <input
                    type="text"
                    value={newMessage.destinataire}
                    onChange={(e) => setNewMessage({ ...newMessage, destinataire: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de l'enseignant ou service"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={newMessage.sujet}
                    onChange={(e) => setNewMessage({ ...newMessage, sujet: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Objet du message"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newMessage.contenu}
                    onChange={(e) => setNewMessage({ ...newMessage, contenu: e.target.value })}
                    rows="8"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Écrivez votre message ici..."
                  ></textarea>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer
                  </button>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;