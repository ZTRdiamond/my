import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { dirname } from "desm";

const __dirname = dirname(import.meta.url);

/**
 * Membaca data portfolio dari JSON.
 *
 * Data yang digunakan hanya data profesional:
 * profile, experience, education, skills, dan languages.
 */
function loadProfessionalData(filePath) {
  const rawData = fs.readFileSync(filePath, "utf8");
  const fullData = JSON.parse(rawData);

  return {
    profile: fullData.profile,
    experience: fullData.experience || [],
    education: fullData.education || [],
    skills: fullData.skills || [],
    languages: fullData.languages || []
  };
}

/**
 * Membangun dokumen PDF resume dengan desain
 * sederhana, monokrom, dan bergaya MS Word.
 */
function generateSimpleWordPDF(data, outputPath) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const colors = {
    black: "#000000",
    darkGray: "#333333",
    lightGray: "#555555",
    line: "#777777"
  };

  const margin = 40;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const bottomMargin = 40;

  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  /**
   * Mengecek apakah konten berikutnya masih muat
   * pada halaman saat ini.
   */
  function checkPageBreak(neededHeight = 30) {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = margin;
    }
  }

  /**
   * Render judul section dengan garis pembatas.
   */
  function renderSectionTitle(title) {
    checkPageBreak(35);

    currentY += 8;

    doc
      .fillColor(colors.black)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(title.toUpperCase(), margin, currentY);

    currentY += 14;

    doc
      .moveTo(margin, currentY)
      .lineTo(margin + contentWidth, currentY)
      .strokeColor(colors.black)
      .lineWidth(0.8)
      .stroke();

    currentY += 8;
  }

  /**
   * ==========================================
   * 1. HEADER
   * ==========================================
   */

  doc
    .fillColor(colors.black)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(data.profile.name, margin, currentY, {
      align: "center",
      width: contentWidth
    });

  currentY += 22;

  doc
    .font("Helvetica-Oblique")
    .fontSize(10)
    .fillColor(colors.darkGray)
    .text(data.profile.title, margin, currentY, {
      align: "center",
      width: contentWidth
    });

  currentY += 16;

  /**
   * Contact information.
   *
   * JSON terbaru tidak memiliki phone,
   * jadi hanya email, lokasi, website, dan GitHub.
   */
  const contactItems = [
    data.profile.email,
    data.profile.location,
    data.profile.website?.replace("https://", ""),
    data.profile.github?.replace("https://", "")
  ].filter(Boolean);

  const contactText = contactItems.join("  •  ");

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(colors.lightGray)
    .text(contactText, margin, currentY, {
      align: "center",
      width: contentWidth
    });

  currentY += 18;

  doc
    .moveTo(margin, currentY)
    .lineTo(margin + contentWidth, currentY)
    .strokeColor(colors.line)
    .lineWidth(0.5)
    .stroke();

  currentY += 8;

  /**
   * ==========================================
   * 2. RINGKASAN PROFIL
   * ==========================================
   */

  if (data.profile.summary) {
    renderSectionTitle("Ringkasan Profil");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(colors.darkGray)
      .text(data.profile.summary, margin, currentY, {
        width: contentWidth,
        align: "justify",
        lineGap: 2
      });

    currentY +=
      doc.heightOfString(data.profile.summary, {
        width: contentWidth,
        lineGap: 2
      }) + 8;
  }

  /**
   * ==========================================
   * 3. PENGALAMAN KERJA
   * ==========================================
   */

  if (data.experience.length > 0) {
    renderSectionTitle("Pengalaman Kerja");

    data.experience.forEach((exp) => {
      checkPageBreak(60);

      /**
       * Posisi dan periode.
       */
      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor(colors.black)
        .text(exp.role, margin, currentY, {
          width: contentWidth - 120
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(colors.darkGray)
        .text(
          `${exp.start} – ${exp.end}`,
          margin + contentWidth - 120,
          currentY,
          {
            align: "right",
            width: 120
          }
        );

      currentY += 12;

      /**
       * Perusahaan, lokasi, dan tipe pekerjaan.
       */
      const experienceMeta = [
        exp.company,
        exp.location,
        exp.type
      ]
        .filter(Boolean)
        .join(" | ");

      doc
        .font("Helvetica-Oblique")
        .fontSize(8.5)
        .fillColor(colors.lightGray)
        .text(experienceMeta, margin, currentY);

      currentY += 12;

      /**
       * Highlights pekerjaan.
       */
      if (Array.isArray(exp.highlights)) {
        exp.highlights.forEach((point) => {
          const bulletWidth = contentWidth - 16;

          const pointHeight = doc.heightOfString(point, {
            width: bulletWidth,
            lineGap: 1.5
          });

          checkPageBreak(pointHeight + 8);

          doc
            .font("Helvetica")
            .fontSize(8.5)
            .fillColor(colors.darkGray)
            .text("• ", margin + 8, currentY, {
              continued: true
            });

          doc.text(point, {
            width: bulletWidth,
            lineGap: 1.5
          });

          currentY += pointHeight + 3;
        });
      }

      currentY += 6;
    });
  }

  /**
   * ==========================================
   * 4. PENDIDIKAN
   * ==========================================
   */

  if (data.education.length > 0) {
    renderSectionTitle("Pendidikan");

    data.education.forEach((edu) => {
      checkPageBreak(45);

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor(colors.black)
        .text(edu.degree, margin, currentY, {
          width: contentWidth - 120
        });

      /**
       * Hanya tampilkan periode jika tersedia.
       */
      if (edu.start != null || edu.end != null) {
        const start = edu.start ?? "";
        const end = edu.end ?? "";

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.darkGray)
          .text(
            `${start} – ${end}`,
            margin + contentWidth - 120,
            currentY,
            {
              align: "right",
              width: 120
            }
          );
      }

      currentY += 12;

      const educationMeta = [
        edu.school,
        edu.location
      ]
        .filter(Boolean)
        .join(" | ");

      doc
        .font("Helvetica-Oblique")
        .fontSize(8.5)
        .fillColor(colors.lightGray)
        .text(educationMeta, margin, currentY);

      currentY += 12;

      if (edu.note) {
        const noteHeight = doc.heightOfString(edu.note, {
          width: contentWidth
        });

        checkPageBreak(noteHeight + 5);

        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.darkGray)
          .text(edu.note, margin, currentY, {
            width: contentWidth
          });

        currentY += noteHeight + 4;
      }

      currentY += 6;
    });
  }

  /**
   * ==========================================
   * 5. KEAHLIAN TEKNIS
   * ==========================================
   */

  if (data.skills.length > 0) {
    renderSectionTitle("Keahlian Teknis");

    data.skills.forEach((skillGroup) => {
      checkPageBreak(25);

      const itemList = skillGroup.items
        .map((item) => item.name)
        .join(", ");

      const fullText = `${skillGroup.category}: ${itemList}`;

      const textHeight = doc.heightOfString(fullText, {
        width: contentWidth
      });

      checkPageBreak(textHeight + 5);

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(colors.black)
        .text(`${skillGroup.category}: `, margin, currentY, {
          continued: true
        });

      doc
        .font("Helvetica")
        .fillColor(colors.darkGray)
        .text(itemList, {
          width: contentWidth
        });

      currentY += textHeight + 4;
    });
  }

  /**
   * ==========================================
   * 6. BAHASA
   * ==========================================
   */

  if (data.languages.length > 0) {
    renderSectionTitle("Bahasa");

    const langList = data.languages
      .map((language) => `${language.name} (${language.label})`)
      .join("  •  ");

    const languageHeight = doc.heightOfString(langList, {
      width: contentWidth
    });

    checkPageBreak(languageHeight + 5);

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(colors.darkGray)
      .text(langList, margin, currentY, {
        width: contentWidth
      });

    currentY += languageHeight + 8;
  }

  /**
   * ==========================================
   * FINISH
   * ==========================================
   */

  doc.end();

  console.log(
    `[Success] PDF Resume berhasil dibuat di: ${outputPath}`
  );
}

/**
 * ==========================================
 * MAIN
 * ==========================================
 */

function main() {
  const jsonPath = path.join(__dirname, "portfolio.json");
  const pdfOutputPath = path.join(
    __dirname,
    "resume-simple-word.pdf"
  );

  if (!fs.existsSync(jsonPath)) {
    console.error(
      `[Error] File ${jsonPath} tidak ditemukan! ` +
      `Pastikan file portfolio.json berada dalam folder yang sama.`
    );

    process.exit(1);
  }

  try {
    const professionalData = loadProfessionalData(jsonPath);

    generateSimpleWordPDF(
      professionalData,
      pdfOutputPath
    );
  } catch (error) {
    console.error(
      "[Error] Gagal membuat PDF:",
      error
    );

    process.exit(1);
  }
}

main();
