# AI-Driven Inventory Forecasting System

A comprehensive MERN stack application that leverages Google's Gemini AI to provide intelligent inventory forecasting and analysis. This system helps businesses optimize stock levels, predict future demand based on sales history, and visualize trends across different regions.

## 🚀 Features

- **AI-Powered Forecasting**: Uses Google Gemini AI to analyze historical sales data and predict future inventory needs.
- **Sales Data Management**: Upload and process sales data via CSV or Excel files.
- **Interactive Dashboard**: Visualizes sales trends and forecasts using interactive charts (Chart.js).
- **Region-based Analysis**: Forecast demand specific to different geographic regions.
- **Report Export**: Generate and download detailed PDF reports of forecasts and inventory status.
- **Secure Backend**: robust Node.js/Express API handling data processing and AI integration.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI library for building interactive interfaces.
- **Vite**: Ultra-fast build tool and development server.
- **Chart.js**: For data visualization and analytics graphs.
- **Axios**: HTTP client for API requests.
- **React Router**: For client-side routing.
- **jsPDF**: For generating downloadable PDF reports.

### Backend
- **Node.js & Express**: Scalable server-side runtime and framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **Google Generative AI**: Integration with Gemini models for forecasting.
- **Multer**: Middleware for handling file uploads.
- **CSV-Parser & XLSX**: For parsing uploaded data files.

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohith-1315/AI-Driven-Inventory-Forecasting-System.git
   cd AI-Driven-Inventory-Forecasting-System
   ```

2. **Install Dependencies**

   *Backend:*
   ```bash
   cd backend
   npm install
   ```

   *Frontend:*
   ```bash
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the Application**

   *Start Backend:*
   ```bash
   cd backend
   npm start
   ```

   *Start Frontend:*
   ```bash
   cd frontend
   npm run dev
   ```

## 📄 License
This project is licensed under the ISC License.
