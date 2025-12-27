import React from 'react';
import jsPDF from 'jspdf';

const ReportExport = ({ forecasts }) => {
    const handleExport = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Inventory Forecast Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);

        let yPos = 50;

        if (forecasts.length === 0) {
            doc.text("No forecasts available.", 20, yPos);
        } else {
            forecasts.forEach((f, index) => {
                doc.text(`${index + 1}. Month: ${f.forecastMonth}`, 20, yPos);
                doc.text(`   Predicted Demand: ${f.predictedDemand}`, 20, yPos + 7);
                doc.text(`   Confidence: ${(f.confidenceScore * 100).toFixed(1)}%`, 20, yPos + 14);

                // Wrap text for reasoning
                const splitReasoning = doc.splitTextToSize(`   Reasoning: ${f.aiReasoning}`, 170);
                doc.text(splitReasoning, 20, yPos + 21);

                yPos += 21 + (splitReasoning.length * 7) + 10;

                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
            });
        }

        doc.save("forecast_report.pdf");
    };

    return (
        <div style={{ marginTop: '40px', borderTop: '1px solid #555', paddingTop: '20px' }}>
            <h3>Actions</h3>
            <button onClick={handleExport} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                Export PDF Report
            </button>
        </div>
    );
};

export default ReportExport;
