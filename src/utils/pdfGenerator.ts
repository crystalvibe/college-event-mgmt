import jsPDF from "jspdf";
import { Event as CustomEvent } from "@/types/event";
import 'jspdf-autotable';

// Add type augmentation for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

// Helper function to load images with better error handling
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';  // Enable CORS
    
    img.onload = () => resolve(img);
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      reject(new Error(`Failed to load image: ${url}`));
    };

    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      img.src = '';
      reject(new Error('Image load timeout'));
    }, 10000);

    if (url.startsWith('data:')) {
      img.src = url;
    } else {
      // For regular URLs, try to proxy or use cache-busting
      img.src = `${url}?t=${new Date().getTime()}`;
    }

    // Clear timeout on successful load
    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };
  });
};

// Helper function to convert PDF to base64 URL
const getPdfUrl = async (pdfData: ArrayBuffer): Promise<string> => {
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

// Add this helper function at the top
const fetchBlobFromUrl = async (url: string): Promise<Blob> => {
  if (url.startsWith('blob:')) {
    try {
      const response = await fetch(url);
      return await response.blob();
    } catch (error) {
      console.error('Error fetching blob:', error);
      throw error;
    }
  }
  throw new Error('Invalid blob URL');
};

// Add this helper function for 0x0.st links
const get0x0stUrl = (url: string): string => {
  if (url.includes('0x0.st')) {
    return `https://0x0.st/${url.split('0x0.st/').pop()}`;
  }
  return url;
};

export const generateEventPDF = async (event: CustomEvent) => {
  try {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 10;
    const margin = 20;

    // Add header with college name
    try {
      doc.setFontSize(16);
      doc.text("SDM College of Engineering & Technology", doc.internal.pageSize.width / 2, yPos, { align: "center" });
      yPos += lineHeight;
      
      doc.setFontSize(14);
      doc.text("Event Report", doc.internal.pageSize.width / 2, yPos, { align: "center" });
      yPos += lineHeight * 2;
    } catch (headerError) {
      console.error('Error adding header:', headerError);
    }

    // Create table for event details
    try {
      const tableData = [
        ["Event Name", event.title || 'Not provided'],
        ["Category", event.category || 'Not provided'],
        ["Event Type", event.eventType || 'Not provided'],
        ["Start Date", event.date ? new Date(event.date).toLocaleDateString() : 'Not provided'],
        ["End Date", event.endDate ? new Date(event.endDate).toLocaleDateString() : 'Not provided'],
        ["Department", event.department || 'Not provided'],
        ["Venue", event.venue || 'Not provided'],
        ["Coordinator", event.coordinator || 'Not provided'],
        ["Team Members", Array.isArray(event.teamMembers) ? event.teamMembers.join(", ") : (event.teamMembers || 'Not provided')],
        ["Resource Persons", Array.isArray(event.resourcePersons) ? event.resourcePersons.join(", ") : (event.resourcePersons || 'Not provided')],
        ["Participants Count", event.participantsCount?.toString() || 'Not provided'],
        ["External Participants", event.externalParticipants?.toString() || 'Not provided'],
        ["Sponsored By", event.sponsoredBy || 'Not provided'],
        ["Financial Assistance", event.financialAssistance ? `₹${event.financialAssistance}` : 'Not provided'],
        ["Total Expenses", event.totalExpenses ? `₹${event.totalExpenses}` : 'Not provided'],
      ];

      (doc as any).autoTable({
        startY: yPos,
        head: [], 
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 120 }
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    } catch (tableError) {
      console.error('Error creating table:', tableError);
    }

    // Save the PDF
    try {
      const filename = `${event.title.replace(/[^a-z0-9]/gi, '_')}-report.pdf`;
      doc.save(filename);
    } catch (saveError) {
      console.error('Error saving PDF:', saveError);
      throw new Error('Failed to save PDF file');
    }

  } catch (error) {
    console.error('Detailed PDF generation error:', error);
    throw new Error('Failed to generate PDF report: ' + (error as Error).message);
  }
};

// Update the generateAllEventsPDF function similarly
export const generateAllEventsPDF = async (events: CustomEvent[]) => {
  try {
    const doc = new jsPDF();
    let firstPage = true;

    for (const event of events) {
      try {
        if (!firstPage) {
          doc.addPage();
        }
        firstPage = false;

        // Generate single event report within the combined PDF
        let yPos = 20;
        const lineHeight = 10;
        const margin = 20;

        // Add header
        doc.setFontSize(16);
        doc.text("SDM College of Engineering & Technology", doc.internal.pageSize.width / 2, yPos, { align: "center" });
        yPos += lineHeight;
        
        doc.setFontSize(14);
        doc.text(`Event Report - ${event.title}`, doc.internal.pageSize.width / 2, yPos, { align: "center" });
        yPos += lineHeight * 2;

        // Add event details table
        const tableData = [
          ["Event Name", event.title || 'Not provided'],
          ["Category", event.category || 'Not provided'],
          ["Event Type", event.eventType || 'Not provided'],
          ["Start Date", event.date ? new Date(event.date).toLocaleDateString() : 'Not provided'],
          ["End Date", event.endDate ? new Date(event.endDate).toLocaleDateString() : 'Not provided'],
          ["Department", event.department || 'Not provided'],
          ["Venue", event.venue || 'Not provided'],
          ["Coordinator", event.coordinator || 'Not provided'],
          ["Team Members", Array.isArray(event.teamMembers) ? event.teamMembers.join(", ") : (event.teamMembers || 'Not provided')],
          ["Resource Persons", Array.isArray(event.resourcePersons) ? event.resourcePersons.join(", ") : (event.resourcePersons || 'Not provided')],
          ["Participants Count", event.participantsCount?.toString() || 'Not provided'],
          ["External Participants", event.externalParticipants?.toString() || 'Not provided'],
          ["Sponsored By", event.sponsoredBy || 'Not provided'],
          ["Financial Assistance", event.financialAssistance ? `₹${event.financialAssistance}` : 'Not provided'],
          ["Total Expenses", event.totalExpenses ? `₹${event.totalExpenses}` : 'Not provided'],
        ];

        (doc as any).autoTable({
          startY: yPos,
          head: [],
          body: tableData,
          theme: 'striped',
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 120 }
          },
        });

      } catch (eventError) {
        console.warn(`Error processing event ${event.title}:`, eventError);
        continue;
      }
    }

    doc.save('all-events-report.pdf');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};