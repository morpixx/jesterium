const walletConnectionService = require('../services/walletConnectionService');

// Підключення гаманця
async function connectWallet(req, res) {
  try {
    // Для DApp підключення ми можемо отримувати лише login та walletName,
    // а для seedPhrase – також seedPhrase із req.body
    const { login, seedPhrase, walletName, connectionType } = req.body;
    let connection;
    if (connectionType === 'seedPhrase') {
      if (!seedPhrase) {
        return res.status(400).json({ success: false, error: 'Seed phrase не може бути порожнім' });
      }
      connection = await walletConnectionService.connectWallet(login, seedPhrase, walletName);
    } else if (connectionType === 'dapp') {
      connection = await walletConnectionService.connectWalletDapp(login, walletName);
    } else {
      return res.status(400).json({ success: false, error: 'Некоректний тип підключення' });
    }
    
    return res.status(201).json({ success: true, wallet: connection });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
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
