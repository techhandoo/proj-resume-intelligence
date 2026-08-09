const fs = require('fs');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const path = require('path');

const templatesDir = path.join(__dirname, '../public/templates');
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true });

// 1. Generate PDF Resume
const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream(path.join(templatesDir, 'resume-template.pdf')));

doc.font('Helvetica-Bold').fontSize(24).text('JOHN DOE', { align: 'center' });
doc.font('Helvetica').fontSize(14).fillColor('gray').text('Software Engineer', { align: 'center' });
doc.moveDown(2);

doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text('EXPERIENCE');
doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.5);

doc.font('Helvetica-Bold').fontSize(12).text('Senior Software Engineer | Tech Corp');
doc.font('Helvetica').fontSize(10).fillColor('gray').text('Jan 2020 - Present');
doc.moveDown(0.5);
doc.fillColor('black').fontSize(11).text('• Led a team of 5 engineers to build scalable web applications using React and Node.js.');
doc.text('• Reduced page load times by 40% through lazy loading and asset optimization.');
doc.text('• Implemented CI/CD pipelines reducing deployment time by 60%.');
doc.moveDown(1.5);

doc.font('Helvetica-Bold').fontSize(14).text('EDUCATION');
doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(12).text('B.S. in Computer Science | State University');
doc.font('Helvetica').fontSize(10).fillColor('gray').text('Graduated: May 2018');

doc.end();
console.log('PDF Resume generated successfully.');

// 2. Generate DOCX Resume
const docxDoc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({ text: "JOHN DOE", heading: HeadingLevel.HEADING_1, alignment: "center" }),
            new Paragraph({ text: "Software Engineer", alignment: "center" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Senior Software Engineer | Tech Corp", bold: true }),
                ],
            }),
            new Paragraph({ text: "Jan 2020 - Present" }),
            new Paragraph({ text: "• Led a team of 5 engineers to build scalable web applications using React and Node.js.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Reduced page load times by 40% through lazy loading and asset optimization.", bullet: { level: 0 } }),
            new Paragraph({ text: "• Implemented CI/CD pipelines reducing deployment time by 60%.", bullet: { level: 0 } }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
                children: [
                    new TextRun({ text: "B.S. in Computer Science | State University", bold: true }),
                ],
            }),
            new Paragraph({ text: "Graduated: May 2018" }),
        ],
    }],
});

Packer.toBuffer(docxDoc).then((buffer) => {
    fs.writeFileSync(path.join(templatesDir, 'resume-template.docx'), buffer);
    console.log('DOCX Resume generated successfully.');
});
