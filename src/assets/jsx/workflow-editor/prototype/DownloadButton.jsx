import {toPng} from 'html-to-image';

function downloadImage(dataUrl) {
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

function DownloadButton() {
    const onClick = (event) => {
        event.preventDefault();

        toPng(document.querySelector('.react-flow'), {
            filter: (node) => {
                // we don't want to add the minimap and the controls to the image
                if (
                    node?.classList?.contains('react-flow__minimap') ||
                    node?.classList?.contains('react-flow__controls') ||
                    node?.classList?.contains('pwe-node-edit-button')
                ) {
                    return false;
                }

                return true;
            },
        }).then(downloadImage);
    };

    return (
        <button className="uk-button uk-button-default" onClick={onClick}>Screenshot</button>
    );
}

export default DownloadButton;
