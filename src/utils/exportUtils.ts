import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Mengubah Teks Markdown AI menjadi file Microsoft Word (.docx)
 * @param title Judul Dokumen (akan jadi nama file)
 * @param markdownContent Teks Markdown dari hasil AI
 */
export const exportToWord = async (title: string, markdownContent: string) => {
  try {
    const lines = markdownContent.split('\n');
    const children: Paragraph[] = [];

    // 1. Judul Utama Dokumen di paling atas
    children.push(
      new Paragraph({
        text: title.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        spaceAfter: { before: 200, after: 200 },
      })
    );

    // 2. Formatting baris per baris dari Markdown
    lines.forEach((line) => {
      const trimmed = line.trim();

      // Heading 1 (# Judul)
      if (trimmed.startsWith('# ')) {
        children.push(
          new Paragraph({
            text: trimmed.replace('# ', ''),
            heading: HeadingLevel.HEADING_1,
            spaceBefore: 300,
            spaceAfter: 100,
          })
        );
      } 
      // Heading 2 (## Sub Judul)
      else if (trimmed.startsWith('## ')) {
        children.push(
          new Paragraph({
            text: trimmed.replace('## ', ''),
            heading: HeadingLevel.HEADING_2,
            spaceBefore: 200,
            spaceAfter: 80,
          })
        );
      } 
      // Heading 3 (### Sub Sub Judul)
      else if (trimmed.startsWith('### ')) {
        children.push(
          new Paragraph({
            text: trimmed.replace('### ', ''),
            heading: HeadingLevel.HEADING_3,
            spaceBefore: 150,
            spaceAfter: 60,
          })
        );
      } 
      // Bullet List (- Poin atau * Poin)
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const cleanText = trimmed.replace(/^[-*]\s+/, '').replace(/\*\*/g, '');
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: cleanText })],
          })
        );
      } 
      // Teks Paragraf Biasa
      else if (trimmed.length > 0) {
        const cleanText = trimmed.replace(/\*\*/g, '');
        children.push(
          new Paragraph({
            children: [new TextRun({ text: cleanText })],
            spaceAfter: 120,
          })
        );
      }
    });

    // 3. Buat Dokumen & Trigger Download
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_AKSIKU.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Gagal mengekspor file Word:', error);
    alert('Terjadi kesalahan saat mengunduh dokumen Word.');
  }
};

/**
 * Membuka jendela dialog printer browser untuk Cetak / Simpan ke PDF
 */
export const printToPdf = () => {
  window.print();
};