import sys
import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # The namespace for w:t is usually http://schemas.openxmlformats.org/wordprocessingml/2006/main
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            texts = []
            for t in tree.findall('.//w:t', namespaces=ns):
                if t.text:
                    texts.append(t.text)
            
            return '\n'.join(texts)
    except Exception as e:
        return f"Error reading {docx_path}: {e}"

if __name__ == '__main__':
    if len(sys.argv) > 2:
        text = extract_text_from_docx(sys.argv[1])
        with open(sys.argv[2], 'w', encoding='utf-8') as f:
            f.write(text)
    else:
        print("Usage: python read_docx.py <input.docx> <output.txt>")
