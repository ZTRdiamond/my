// ─────────────────────────────────────────────────────────────────────────────
// PDF Generation Service — Portfolio CV
// Follows pdf.js logic — natural multi-page flow, A4 with margins
// ─────────────────────────────────────────────────────────────────────────────

import PDFDocument from 'pdfkit';

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 40;
const CONTENT_W = A4_W - MARGIN * 2;
const BOTTOM_MARGIN = 40;

export function generatePortfolioPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        info: {
          Title: `CV - ${data.profile?.name || 'Portfolio'}`,
          Author: data.profile?.name || 'Fatahillah Al Makarim',
          Subject: 'Curriculum Vitae',
        },
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const colors = {
        black: '#000000',
        darkGray: '#333333',
        lightGray: '#555555',
        line: '#777777',
      };

      let y = MARGIN;

      // ── HELPERS ──

      function checkPageBreak(minNeeded = 30) {
        if (y + minNeeded > A4_H - BOTTOM_MARGIN) {
          doc.addPage();
          y = MARGIN;
        }
      }

      function sectionTitle(title) {
        checkPageBreak(35);
        y += 8;

        doc.fillColor(colors.black).font('Helvetica-Bold').fontSize(11)
          .text(title.toUpperCase(), MARGIN, y);
        y += 14;

        doc.moveTo(MARGIN, y).lineTo(MARGIN + CONTENT_W, y)
          .strokeColor(colors.black).lineWidth(0.8).stroke();
        y += 8;
      }

      // ── HEADER ──

      doc.fillColor(colors.black).font('Helvetica-Bold').fontSize(18)
        .text(data.profile?.name || '', MARGIN, y, { align: 'center', width: CONTENT_W });
      y += 22;

      doc.font('Helvetica-Oblique').fontSize(10).fillColor(colors.darkGray)
        .text(data.profile?.title || '', MARGIN, y, { align: 'center', width: CONTENT_W });
      y += 16;

      const contactItems = [
        data.profile?.email || '',
        data.profile?.location || '',
        data.profile?.website?.replace('https://', '').replace('http://', '') || '',
        data.profile?.github?.replace('https://', '') || '',
      ].filter(Boolean);

      const contactText = contactItems.join('  •  ');
      doc.font('Helvetica').fontSize(8.5).fillColor(colors.lightGray)
        .text(contactText, MARGIN, y, { align: 'center', width: CONTENT_W });
      y += 18;

      doc.moveTo(MARGIN, y).lineTo(MARGIN + CONTENT_W, y)
        .strokeColor(colors.line).lineWidth(0.5).stroke();
      y += 8;

      // ── RINGKASAN PROFIL ──

      if (data.profile?.summary) {
        sectionTitle('Ringkasan Profil');

        checkPageBreak(30);
        doc.font('Helvetica').fontSize(9).fillColor(colors.darkGray)
          .text(data.profile.summary, MARGIN, y, {
            width: CONTENT_W,
            align: 'justify',
            lineGap: 2,
          });
        y += doc.heightOfString(data.profile.summary, { width: CONTENT_W, lineGap: 2 }) + 8;
      }

      // ── PENGALAMAN KERJA ──

      if (data.experience?.length) {
        sectionTitle('Pengalaman Kerja');

        for (const exp of data.experience) {
          checkPageBreak(60);

          // Role + Date
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor(colors.black)
            .text(exp.role || '', MARGIN, y, { width: CONTENT_W - 120 });
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.darkGray)
            .text(`${exp.start || ''} – ${exp.end || ''}`, MARGIN + CONTENT_W - 120, y, { align: 'right', width: 120 });
          y += 12;

          // Company | Location | Type
          const meta = [exp.company, exp.location, exp.type].filter(Boolean).join(' | ');
          doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(colors.lightGray)
            .text(meta, MARGIN, y);
          y += 12;

          // Highlights
          if (Array.isArray(exp.highlights)) {
            for (const point of exp.highlights) {
              const ph = doc.heightOfString(point, { width: CONTENT_W - 16, lineGap: 1.5 });
              checkPageBreak(ph + 8);

              doc.font('Helvetica').fontSize(8.5).fillColor(colors.darkGray)
                .text('•  ' + point, MARGIN + 8, y, { width: CONTENT_W - 16, lineGap: 1.5 });
              y += ph + 3;
            }
          }
          y += 6;
        }
      }

      // ── PENDIDIKAN ──

      if (data.education?.length) {
        sectionTitle('Pendidikan');

        for (const edu of data.education) {
          checkPageBreak(45);

          doc.font('Helvetica-Bold').fontSize(9.5).fillColor(colors.black)
            .text(edu.degree || '', MARGIN, y, { width: CONTENT_W - 120 });

          if (edu.start != null || edu.end != null) {
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.darkGray)
              .text(`${edu.start ?? ''} – ${edu.end ?? ''}`, MARGIN + CONTENT_W - 120, y, { align: 'right', width: 120 });
          }
          y += 12;

          const eduMeta = [edu.school, edu.location].filter(Boolean).join(' | ');
          doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(colors.lightGray)
            .text(eduMeta, MARGIN, y);
          y += 12;

          if (edu.note) {
            const noteH = doc.heightOfString(edu.note, { width: CONTENT_W });
            checkPageBreak(noteH + 5);
            doc.font('Helvetica').fontSize(8.5).fillColor(colors.darkGray)
              .text(edu.note, MARGIN, y, { width: CONTENT_W });
            y += noteH + 4;
          }
          y += 6;
        }
      }

      // ── KEAHLIAN TEKNIS ──

      if (data.skills?.length) {
        sectionTitle('Keahlian Teknis');

        for (const group of data.skills) {
          const itemList = group.items?.map(i => i.name).join(', ') || '';
          const fullText = `${group.category}: ${itemList}`;
          const textH = doc.heightOfString(fullText, { width: CONTENT_W });

          checkPageBreak(textH + 5);

          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.black)
            .text(`${group.category}: `, MARGIN, y, { continued: true });
          doc.font('Helvetica').fontSize(8.5).fillColor(colors.darkGray)
            .text(itemList, { width: CONTENT_W });
          y += textH + 4;
        }
      }

      // ── BAHASA ──

      if (data.languages?.length) {
        sectionTitle('Bahasa');

        const langList = data.languages
          .map(l => `${l.name} (${l.label})`)
          .join('  •  ');

        const langH = doc.heightOfString(langList, { width: CONTENT_W });
        checkPageBreak(langH + 5);

        doc.font('Helvetica').fontSize(8.5).fillColor(colors.darkGray)
          .text(langList, MARGIN, y, { width: CONTENT_W });
        y += langH + 8;
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
