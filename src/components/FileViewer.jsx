import getFileType  from '../Utils/getFileType'

const FileViewer = ({ fileUrl }) => {

 const fileType = getFileType(fileUrl);


    if (fileType === 'pdf') {
        return (
            <iframe
                src={fileUrl}
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="PDF Viewer"
            />
        );
    }

    if (fileType === 'image') {
        return (
            <img
                src={fileUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '600px' }}
            />
        );
    }

    if (fileType === 'doc') {
        const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(
            fileUrl
        )}&embedded=true`;
        return (
            <iframe
                src={googleViewer}
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="DOC Viewer"
            />
        );
    }

    return (
        <a href={fileUrl} target="_blank" rel="noreferrer">
            Download File
        </a>
    );
}

export default FileViewer