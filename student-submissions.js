console.log('Student Submissions: Script loaded');

function checkAndInject() {
    const data = JSON.parse(localStorage.getItem('ggnet_data') || '{}');
    
    // Check if superadmin is logged in
    if (!currentUser || currentUser.role !== 'superadmin') return;
    
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    if (!contentArea.innerHTML.includes('Resources')) return;
    if (document.getElementById('student-submissions-final')) return;
    
    const uploads = data.studentUploads || [];
    
    const html = `
    <div id="student-submissions-final" style="margin-top: 2rem; padding: 1rem; background: #fef3c7; border: 4px solid #dc2626; border-radius: 8px;">
        <h3 style="font-size: 24px; font-weight: bold; color: black; margin-bottom: 1rem;">STUDENT SUBMISSIONS</h3>
        <div style="background: white; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: #f3f4f6;">
                    <tr>
                        <th style="padding: 12px; text-align: left;">Student</th>
                        <th style="padding: 12px; text-align: left;">File Name</th>
                        <th style="padding: 12px; text-align: left;">Upload Date</th>
                        <th style="padding: 12px; text-align: left;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${uploads.length === 0 
                        ? '<tr><td colspan="4" style="padding: 20px; text-align: center;">No uploads yet</td></tr>' 
                        : uploads.map((u, i) => `
                            <tr style="border-top: 1px solid #e5e7eb;">
                                <td style="padding: 12px;">
                                    <div style="font-weight: 500;">${u.student_name || u.studentName || 'Unknown'}</div>
                                    <div style="font-size: 12px; color: #6b7280;">${u.student_email || u.studentEmail || ''}</div>
                                </td>
                                <td style="padding: 12px;">${u.name || u.fileName || 'file'}</td>
                                <td style="padding: 12px; color: #6b7280;">${new Date(u.upload_date || u.uploadDate).toLocaleString()}</td>
                                <td style="padding: 12px;">
                                <button 
                                type="button" 
                                onclick="event.preventDefault(); downloadDoc(${u.id})" 
                                style="color: #2563eb; margin-right: 12px; background: none; border: none; cursor: pointer;"
                            >
                                Download
                            </button>
                                    <button onclick="deleteUpload(${i})" style="color: #dc2626; background: none; border: none; cursor: pointer;">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
    
    contentArea.insertAdjacentHTML('beforeend', html);
}

window.deleteUpload = function(i) {
    if (!confirm('Delete this upload?')) return;
    const data = JSON.parse(localStorage.getItem('ggnet_data') || '{}');
    data.studentUploads.splice(i, 1);
    localStorage.setItem('ggnet_data', JSON.stringify(data));
    
    showToast('Upload deleted');
    navigateTo('documents'); // Re-render, no reload
}

window.deleteStudentUpload = function(i) {
    if (!confirm('Delete this student submission?')) return;
    const data = JSON.parse(localStorage.getItem('ggnet_data') || '{}');
    data.studentUploads.splice(i, 1);
    localStorage.setItem('ggnet_data', JSON.stringify(data));
    
    showToast('Submission deleted');
    navigateTo('documents'); // Re-render, no reload
}

setInterval(checkAndInject, 1000);