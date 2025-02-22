const walletConnectionService = require('../services/walletConnectionService');

// Підключення гаманця
async function connectWallet(req, res) {
  try {
    const { login, seedPhrase, walletName } = req.body;
    const connection = await walletConnectionService.connectWallet(login, seedPhrase, walletName);
    res.status(201).json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Отримання даних підключення гаманця за ID
async function getWalletConnection(req, res) {
  try {
    const id = req.params.id;
    const connection = await walletConnectionService.getWalletConnection(id);
    if (!connection) {
      return res.status(404).json({ error: "Wallet connection not found" });
    }
    res.status(200).json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Відключення (або оновлення статусу) гаманця
async function disconnectWallet(req, res) {
  try {
    const id = req.params.id;
    const result = await walletConnectionService.disconnectWallet(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { connectWallet, getWalletConnection, disconnectWallet };
