import React from 'react';

// Composant de graphique en barres simple
export const BarChart = ({ data, title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="w-full">
      {title && <h4 className="text-lg font-bold text-gray-800 mb-4">{title}</h4>}
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 60) : 0;
          const color = colors[index % colors.length];
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
              <div className="text-center mb-1">
                <span className="text-sm font-bold text-gray-700">{item.value}</span>
              </div>
              <div
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  minHeight: item.value > 0 ? '20px' : '0px'
                }}
                title={`${item.label}: ${item.value}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}: {item.value}
                </div>
              </div>
              <div className="text-xs text-gray-600 text-center mt-2 break-words w-full px-1">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant de graphique en camembert (donut)
export const PieChart = ({ data, title, size = 200 }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  let currentAngle = -90; // Commence en haut

  return (
    <div className="w-full">
      {title && <h4 className="text-lg font-bold text-gray-800 mb-4">{title}</h4>}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const angle = (percentage / 100) * 360;
              const color = colors[index % colors.length];
              
              // Calcul des coordonnées pour l'arc
              const radius = size / 2 - 10;
              const innerRadius = radius * 0.6; // Pour l'effet donut
              const centerX = size / 2;
              const centerY = size / 2;
              
              const startAngle = (currentAngle * Math.PI) / 180;
              const endAngle = ((currentAngle + angle) * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);
              
              const ix1 = centerX + innerRadius * Math.cos(startAngle);
              const iy1 = centerY + innerRadius * Math.sin(startAngle);
              const ix2 = centerX + innerRadius * Math.cos(endAngle);
              const iy2 = centerY + innerRadius * Math.sin(endAngle);
              
              const largeArc = angle > 180 ? 1 : 0;
              
              const path = `
                M ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                L ${ix2} ${iy2}
                A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}
                Z
              `;
              
              currentAngle += angle;
              
              return (
                <g key={index}>
                  <path
                    d={path}
                    fill={color}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    title={`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}
                  />
                </g>
              );
            })}
            {/* Texte au centre */}
            <text
              x={size / 2}
              y={size / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold fill-gray-700"
            >
              {total}
            </text>
            <text
              x={size / 2}
              y={size / 2 + 20}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-500"
            >
              Total
            </text>
          </svg>
        </div>
        
        {/* Légende */}
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                  <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Composant de graphique en lignes
export const LineChart = ({ data, title, height = 250 }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;
  const width = 800;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Générer les points pour la ligne
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((item.value - minValue) / range) * chartHeight;
    return { x, y, ...item };
  });

  // Créer le path SVG
  const linePath = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Créer l'area sous la ligne
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="w-full">
      {title && <h4 className="text-lg font-bold text-gray-800 mb-4">{title}</h4>}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grille */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i * chartHeight) / 4;
          const value = maxValue - (i * range) / 4;
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* Area sous la ligne */}
        <path
          d={areaPath}
          fill="#3B82F6"
          fillOpacity="0.1"
        />

        {/* Ligne */}
        <path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke="#3B82F6"
              strokeWidth="3"
              className="cursor-pointer hover:r-6 transition-all"
            />
            <text
              x={point.x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Composant de carte statistique avec tendance
export const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    stable: "text-gray-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <p className={`text-sm mt-2 ${trendColors[trend.direction]}`}>
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default { BarChart, PieChart, LineChart, StatCard };
