import React from "react";
import { FaUsers } from "react-icons/fa";

export default function DataTable({
  // PageHeader props
  icon: Icon = FaUsers,
  title = "Data Table",
  description,
  iconColor = "blue",
  
  // Table props
  data = [],
  columns = [],
  selectedRows = [],
  onRowSelect,
  
  // Pagination props
  currentPage = 1,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  onItemsPerPageChange,
  
  // Customization
  showHeader = true,
  showPagination = true,
  showSelection = true,
  
  // Styling
  className = ""
}) {

  // Color schemes for icon background
  const iconColorSchemes = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500"
  };

  const iconBgColor = iconColorSchemes[iconColor] || iconColorSchemes.blue;



  // Handle row selection
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = data.map(item => item.id);
      onRowSelect?.(allIds, true);
    } else {
      onRowSelect?.([], false);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      onRowSelect?.([...selectedRows, id], true);
    } else {
      onRowSelect?.(selectedRows.filter(rowId => rowId !== id), false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={`${className}`}>
      
             {/* TableContainer dengan header dan table dalam satu container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-6xl mx-auto">
        
        {/* PageHeader */}
        {showHeader && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              {Icon && (
                <div className={`${iconBgColor} p-3 rounded-lg mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
                
                {/* Badge jumlah data */}
                {description && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                      {description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
                 {/* Table */}
         <div className="overflow-x-auto">
           <table className="w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
            
                         {/* Table Header */}
             <thead className="bg-gray-50">
               <tr>
                 {/* Checkbox column */}
                 {showSelection && (
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                     <input
                       type="checkbox"
                       checked={selectedRows.length === data.length && data.length > 0}
                       onChange={(e) => handleSelectAll(e.target.checked)}
                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                     />
                   </th>
                 )}
                 
                 {/* Nomor urut column */}
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                   No
                 </th>
                 
                                   {/* Dynamic columns */}
                  {columns.map((column, index) => (
                    <th
                      key={column.key || index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ 
                        width: column.width || 
                          (column.key === 'nama' ? '280px' : 
                           column.key === 'nip' ? '200px' : 
                           column.key === 'role' ? '120px' : 
                           column.key === 'status' ? '120px' : 
                           column.key === 'actions' ? '150px' : 'auto')
                      }}
                    >
                      <span>{column.header}</span>
                    </th>
                  ))}
               </tr>
             </thead>
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (showSelection ? 2 : 1)} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-lg font-medium">Tidak ada data</p>
                      <p className="text-sm">Belum ada data yang ditambahkan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr 
                    key={row.id || rowIndex} 
                    className={`hover:bg-gray-50 transition-colors ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                                        {/* Checkbox cell */}
                    {showSelection && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-12">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                    )}
                    
                    {/* Nomor urut cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-16">
                      {startIndex + rowIndex + 1}
                    </td>
                    
                    {/* Dynamic cells */}
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.key || colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        style={{ width: column.width || 'auto' }}
                      >
                        {column.cell ? (
                          column.cell(row[column.key], row, rowIndex)
                        ) : (
                          <span>{row[column.key]}</span>
                        )}
                      </td>
                    ))}
                 </tr>
               ))
             )}
           </tbody>
         </table>
       </div>
       
       {/* Pagination */}
       {showPagination && totalItems > 0 && (
         <div className="bg-white px-6 py-3 border-t border-gray-200">
           <div className="flex flex-col sm:flex-row items-center gap-4">
             
             {/* Left: Items per page selector */}
             <div className="flex items-center gap-2">
               <span className="text-sm text-gray-700">Tampilkan:</span>
               <select
                 value={itemsPerPage}
                 onChange={(e) => onItemsPerPageChange?.(parseInt(e.target.value))}
                 className="border border-blue-500 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 {[5, 10, 25, 50, 100].map(size => (
                   <option key={size} value={size}>{size}</option>
                 ))}
               </select>
               <span className="text-sm text-gray-700">dari {totalItems} akun</span>
             </div>
             
             {/* Center: Page info */}
             <div className="flex-1 flex justify-center">
               <span className="text-sm text-gray-700">
                 Halaman {currentPage} dari {totalPages} ({startIndex + 1}-{endIndex} dari {totalItems})
               </span>
             </div>
             
             {/* Right: Page navigation */}
             <div className="flex items-center gap-2">
               {/* First page button */}
               <button
                 onClick={() => onPageChange?.(1)}
                 disabled={currentPage === 1}
                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 《
               </button>
               
               {/* Previous button */}
               <button
                 onClick={() => onPageChange?.(currentPage - 1)}
                 disabled={currentPage === 1}
                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 &lt;
               </button>
               
               {/* Page numbers */}
               <div className="flex items-center gap-1">
                 {getPageNumbers().map((page, index) => (
                   <button
                     key={index}
                     onClick={() => typeof page === 'number' && onPageChange?.(page)}
                     disabled={page === '...'}
                     className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                       page === currentPage
                         ? 'bg-blue-600 text-white border-blue-600'
                         : page === '...'
                         ? 'border-gray-300 text-gray-400 cursor-default'
                         : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                     }`}
                   >
                     {page}
                   </button>
                 ))}
               </div>
               
               {/* Next button */}
               <button
                 onClick={() => onPageChange?.(currentPage + 1)}
                 disabled={currentPage === totalPages}
                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 &gt;
               </button>
               
               {/* Last page button */}
               <button
                 onClick={() => onPageChange?.(totalPages)}
                 disabled={currentPage === totalPages}
                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 》
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}
