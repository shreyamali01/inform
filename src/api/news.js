// api/news.js
export default async function handler(req, res) {
  const { searchTerm } = req.query;
  const apiKey = process.env.REACT_APP_NEWS_API_KEY; // Key is hidden

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}`
    );
    const data = await response.json();

    // Add CORS headers to avoid browser issues
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "API request failed" });
  }
}
