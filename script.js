let currentGenerator = 'brat';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.generator-btn').forEach(button => {
        button.addEventListener('click', function() {
            const generatorType = this.getAttribute('data-generator');
            switchGenerator(generatorType);
        });
    });
    
    document.getElementById('btn-brat').addEventListener('click', () => processBrat());
    document.getElementById('btn-iqc').addEventListener('click', () => processIqc());
    document.getElementById('btn-bluearchive').addEventListener('click', () => processBlueArchive());
    
    document.getElementById('download-brat').addEventListener('click', () => downloadImage('brat'));
    document.getElementById('download-iqc').addEventListener('click', () => downloadImage('iqc'));
    document.getElementById('download-bluearchive').addEventListener('click', () => downloadImage('bluearchive'));
});

function switchGenerator(generatorType) {
    document.querySelectorAll('.generator-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.generator-btn[data-generator="${generatorType}"]`).classList.add('active');
    
    document.querySelectorAll('.generator-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${generatorType}-section`).classList.add('active');
    
    currentGenerator = generatorType;
}

function encodeText(text) {
    return text.replace(/ /g, '+');
}

function showError(message) {
    document.getElementById('error-text').textContent = message;
    document.getElementById('error-message').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('error-message').classList.remove('active');
    }, 5000);
}

async function processBrat() {
    const text = document.getElementById('brat-text').value.trim();
    if (!text) {
        showError('Mohon masukkan teks untuk gambar Brat HD');
        return;
    }
    
    const encodedText = encodeText(text);
    const apiEndpoint = `https://api-faa.my.id/faa/brathd?text=${encodedText}`;
    
    document.getElementById('loading-brat').classList.add('active');
    document.getElementById('result-brat').classList.remove('active');
    document.getElementById('error-message').classList.remove('active');
    
    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        
        const imageBlob = await response.blob();
        
        if (imageBlob.size === 0) {
            throw new Error('Gambar kosong');
        }
        
        const imageUrl = URL.createObjectURL(imageBlob);
        const imageElement = document.getElementById('image-brat');
        imageElement.src = imageUrl;
        imageElement.setAttribute('data-blob-url', imageUrl);
        
        document.getElementById('loading-brat').classList.remove('active');
        document.getElementById('result-brat').classList.add('active');
        
    } catch (error) {
        console.error('Brat Error:', error);
        document.getElementById('loading-brat').classList.remove('active');
        showError('Gagal memproses gambar Brat HD');
    }
}

async function processIqc() {
    const text = document.getElementById('iqc-text').value.trim();
    if (!text) {
        showError('Mohon masukkan teks untuk gambar iQC');
        return;
    }
    
    const encodedText = encodeText(text);
    const apiEndpoint = `https://api-faa.my.id/faa/iqc?prompt=${encodedText}`;
    
    document.getElementById('loading-iqc').classList.add('active');
    document.getElementById('result-iqc').classList.remove('active');
    document.getElementById('error-message').classList.remove('active');
    
    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        
        const imageBlob = await response.blob();
        
        if (imageBlob.size === 0) {
            throw new Error('Gambar kosong');
        }
        
        const imageUrl = URL.createObjectURL(imageBlob);
        const imageElement = document.getElementById('image-iqc');
        imageElement.src = imageUrl;
        imageElement.setAttribute('data-blob-url', imageUrl);
        
        document.getElementById('loading-iqc').classList.remove('active');
        document.getElementById('result-iqc').classList.add('active');
        
    } catch (error) {
        console.error('iQC Error:', error);
        document.getElementById('loading-iqc').classList.remove('active');
        showError('Gagal memproses gambar iQC');
    }
}

async function processBlueArchive() {
    const textL = document.getElementById('bluearchive-textL').value.trim();
    const textR = document.getElementById('bluearchive-textR').value.trim();
    
    if (!textL && !textR) {
        showError('Mohon masukkan teks untuk setidaknya satu sisi logo');
        return;
    }
    
    const encodedTextL = encodeText(textL);
    const encodedTextR = encodeText(textR);
    const apiEndpoint = `https://api.nekolabs.web.id/cnv/ba-logo?textL=${encodedTextL}&textR=${encodedTextR}`;
    
    document.getElementById('bluearchive-api-info').textContent = `Endpoint: ${apiEndpoint}`;
    document.getElementById('bluearchive-api-info').classList.add('active');
    
    document.getElementById('loading-bluearchive').classList.add('active');
    document.getElementById('result-bluearchive').classList.remove('active');
    document.getElementById('error-message').classList.remove('active');
    
    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        
        const imageBlob = await response.blob();
        
        if (imageBlob.size === 0) {
            throw new Error('Gambar kosong diterima');
        }
        
        const blobType = imageBlob.type;
        console.log('Blue Archive Blob type:', blobType, 'Size:', imageBlob.size);
        
        const imageUrl = URL.createObjectURL(imageBlob);
        const imageElement = document.getElementById('image-bluearchive');
        
        if (blobType.startsWith('image/')) {
            imageElement.src = imageUrl;
        } 
        else if (blobType === 'application/octet-stream' || blobType === '') {
            imageElement.src = imageUrl;
        }
        else {
            throw new Error(`Tipe data tidak dikenali: ${blobType}`);
        }
        
        imageElement.setAttribute('data-blob-url', imageUrl);
        
        document.getElementById('loading-bluearchive').classList.remove('active');
        document.getElementById('result-bluearchive').classList.add('active');
        
    } catch (error) {
        console.error('Blue Archive Error:', error);
        document.getElementById('loading-bluearchive').classList.remove('active');
        document.getElementById('bluearchive-api-info').classList.remove('active');
        showError(`Gagal memproses logo Blue Archive: ${error.message}`);
    }
}

function downloadImage(generatorType) {
    const imageElement = document.getElementById(`image-${generatorType}`);
    const imageUrl = imageElement.getAttribute('data-blob-url');
    
    if (!imageUrl || !imageElement.src) {
        showError('Tidak ada gambar yang dapat diunduh');
        return;
    }
    
    let generatorName;
    switch(generatorType) {
        case 'brat': generatorName = 'Brat-HD'; break;
        case 'iqc': generatorName = 'iPhone-iQC'; break;
        case 'bluearchive': generatorName = 'Blue-Archive'; break;
    }
    
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = `Satria-Generator-${generatorName}-${Date.now()}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}