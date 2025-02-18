export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const readJsonFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = JSON.parse(e.target.result);
                resolve(content);
            } catch (error) {
                reject(new Error('Invalid JSON file content.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file.'));
        };

        reader.readAsText(file);
    });
};
