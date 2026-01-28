window.initQuillEditor = function(elementId, dotNetRef) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return false;
        }

        // Check if Quill is loaded
        if (typeof Quill === 'undefined') {
            console.error('Quill is not loaded');
            return false;
        }

        // Initialize Quill with comprehensive toolbar
        window.quillEditor = new Quill('#' + elementId, {
            theme: 'snow',
            placeholder: 'Write your thoughts here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        // If DotNet reference provided, register change event to notify Blazor
        try {
            if (dotNetRef && typeof dotNetRef.invokeMethodAsync === 'function') {
                window.quillEditor.on('text-change', function() {
                    try {
                        // Check if the reference is still valid
                        if (dotNetRef && typeof dotNetRef.invokeMethodAsync === 'function') {
                            dotNetRef.invokeMethodAsync('OnQuillTextChanged');
                        }
                    } catch (err) {
                        console.error('Error invoking .NET method from Quill text-change:', err);
                        // Remove the event listener if it fails
                        if (window.quillEditor) {
                            try { window.quillEditor.off('text-change'); } catch(e) {}
                        }
                    }
                });
            }
        } catch (err) {
            console.warn('Failed to register text-change handler:', err);
        }

        console.log('Quill editor initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Quill:', error);
        return false;
    }
};

// Get HTML content from Quill editor
window.getQuillContent = function() {
    if (window.quillEditor) {
        return window.quillEditor.root.innerHTML;
    }
    return '';
};

// Set content in Quill editor
window.setQuillContent = function(content) {
    if (window.quillEditor && content) {
        window.quillEditor.root.innerHTML = content;
    }
};

// Get plain text from Quill editor
window.getQuillText = function() {
    if (window.quillEditor) {
        return window.quillEditor.getText();
    }
    return '';
};

// Get word count
window.getQuillWordCount = function() {
    if (window.quillEditor) {
        const text = window.quillEditor.getText().trim();
        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }
    return 0;
};

// Download a file (used for export). filename: string, content: string, mimeType: string
window.downloadFile = function(filename, content, mimeType) {
    try {
        mimeType = mimeType || 'text/html';
        const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // IE/Edge
            window.navigator.msSaveOrOpenBlob(blob, filename);
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    } catch (err) {
        console.error('downloadFile error:', err);
    }
};

window.exportHtmlToPdf = function(filename, htmlContent) {
    try {
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf is not loaded');
            return false;
        }

        // Create a temporary container
        var container = document.createElement('div');
        container.style.padding = '20px';
        container.style.maxWidth = '800px';
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        var opt = {
            margin:       10,
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(container).save().then(function() {
            document.body.removeChild(container);
        }).catch(function(err) {
            console.error('html2pdf error:', err);
            document.body.removeChild(container);
        });

        return true;
    } catch (err) {
        console.error('exportHtmlToPdf error:', err);
        return false;
    }
};

window.exportElementToPdf = function(elementId, filename) {
    try {
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf is not loaded');
            return false;
        }
        var element = document.getElementById(elementId);
        if (!element) return false;

        var opt = {
            margin:       10,
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
        return true;
    }
    catch (err) {
        console.error('exportElementToPdf error:', err);
        return false;
    }
};