import React, { useState } from 'react';

const Upload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [campaign, setCampaign] = useState('');
  const [client, setClient] = useState('');
  const [caption, setCaption] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = () => {
    onUpload({
      name: `Piece for ${campaign}`,
      files,
      campaign,
      client,
      caption,
      status: 'Pending Approval',
    });
    setFiles([]);
    setCampaign('');
    setClient('');
    setCaption('');
  };

  return (
    <div>
      <h3>Upload New Piece</h3>
      <input type="file" multiple onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Campaign"
        value={campaign}
        onChange={(e) => setCampaign(e.target.value)}
      />
      <input
        type="text"
        placeholder="Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
