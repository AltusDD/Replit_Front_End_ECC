import React, { useState } from 'react';
import { PropertyCardDTO } from '../types';

interface FilesProps {
  data: PropertyCardDTO;
}

export default function Files({ data }: FilesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample files data
  const files = [
    {
      id: '1',
      name: 'Property_Deed_1289_West_19th.pdf',
      category: 'Legal',
      size: '2.4 MB',
      modified: '2024-01-15',
      type: 'pdf',
      pinned: true
    },
    {
      id: '2',
      name: 'Insurance_Policy_2024.pdf',
      category: 'Insurance',
      size: '1.8 MB',
      modified: '2024-01-01',
      type: 'pdf',
      pinned: true
    },
    {
      id: '3',
      name: 'Floor_Plans_Updated.dwg',
      category: 'Plans',
      size: '5.2 MB',
      modified: '2023-12-20',
      type: 'dwg',
      pinned: false
    },
    {
      id: '4',
      name: 'Annual_Inspection_Report_2024.pdf',
      category: 'Maintenance',
      size: '3.1 MB',
      modified: '2024-01-10',
      type: 'pdf',
      pinned: false
    },
    {
      id: '5',
      name: 'Property_Photos_Exterior.zip',
      category: 'Media',
      size: '12.7 MB',
      modified: '2023-11-30',
      type: 'zip',
      pinned: false
    }
  ];

  const categories = ['all', 'Legal', 'Insurance', 'Plans', 'Maintenance', 'Media'];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'dwg': return '📐';
      case 'zip': return '📦';
      case 'jpg':
      case 'png': return '🖼️';
      default: return '📁';
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      {/* Actions Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 'var(--gap-3)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: 'var(--gap-2)', flex: 1 }}>
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              color: 'var(--text)',
              fontSize: 'var(--fs-14)',
              minWidth: '200px',
              flex: 1
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              color: 'var(--text)',
              fontSize: 'var(--fs-14)'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        <button style={{
          background: 'var(--gold)',
          color: 'var(--bg)',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Upload File
        </button>
      </div>

      {/* Pinned Files */}
      {files.some(f => f.pinned) && (
        <div>
          <h3 style={{ 
            fontSize: 'var(--fs-16)', 
            fontWeight: 600, 
            color: 'var(--text)', 
            marginBottom: 'var(--gap-2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📌 Pinned Files
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: 'var(--gap-2)' 
          }}>
            {files.filter(f => f.pinned).map(file => (
              <div key={file.id} style={{
                background: 'var(--surface-2)',
                border: '2px solid var(--gold)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--gap-3)',
                cursor: 'pointer',
                transition: 'all var(--t-fast) var(--ease)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-2)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{getFileIcon(file.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      color: 'var(--text)', 
                      fontSize: 'var(--fs-14)', 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {file.name}
                    </div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                      {file.size} • {file.category}
                    </div>
                  </div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-12)' }}>
                  Modified: {new Date(file.modified).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Files */}
      <div>
        <h3 style={{ 
          fontSize: 'var(--fs-16)', 
          fontWeight: 600, 
          color: 'var(--text)', 
          marginBottom: 'var(--gap-2)' 
        }}>
          All Files ({filteredFiles.length})
        </h3>
        
        {filteredFiles.length > 0 ? (
          <div style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    NAME
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    CATEGORY
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    SIZE
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    MODIFIED
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file, index) => (
                  <tr key={file.id} style={{ 
                    borderBottom: index < filteredFiles.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer'
                  }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-2)' }}>
                        <span style={{ fontSize: '20px' }}>{getFileIcon(file.type)}</span>
                        <div>
                          <div style={{ color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 500 }}>
                            {file.name}
                          </div>
                          {file.pinned && (
                            <span style={{ 
                              color: 'var(--gold)', 
                              fontSize: 'var(--fs-12)', 
                              fontWeight: 600 
                            }}>
                              📌 Pinned
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: 'var(--surface)',
                        color: 'var(--text-subtle)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 'var(--fs-12)',
                        fontWeight: 600
                      }}>
                        {file.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                      {file.size}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                      {new Date(file.modified).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 8px',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontSize: 'var(--fs-12)'
                      }}>
                        ⋯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: 'var(--gap-4)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>📁</div>
            <div style={{ color: 'var(--text)', fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: '8px' }}>
              No Files Found
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-14)' }}>
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload files to get started.'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}