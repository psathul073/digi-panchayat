
const getFileType = (url) => {

    const ext = url.split('.').pop().toLowerCase();
    
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    return 'unknown';
}

export default getFileType