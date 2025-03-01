const walletConnectionDao = require('../dao/walletConnectionDao');

// Підключення гаманця
async function connectWallet(login, seedPhrase, walletName) {
  // Допустимі назви крипто гаманців через Dapp
  const allowedWallets = ['Phantom', 'TrustWallet', 'Metamask'];
  
  if (!allowedWallets.includes(walletName)) {
    throw new Error('Невідомий крипто гаманець. Допустимі варіанти: Phantom, TrustWallet, Metamask');
  }
  
  const newConnection = {
    id: null,
    seedPhrase,
    status: 'connected',
    login,
    walletName
  };
  
  return await walletConnectionDao.createWalletConnection(newConnection);
}

// Отримання даних підключення гаманця
async function getWalletConnection(id) {
  return await walletConnectionDao.getWalletConnectionById(id);
}

// Відключення гаманця (оновлення статусу)
async function disconnectWallet(id) {
  await walletConnectionDao.updateWalletConnectionStatus(id, 'not connected');
  return { message: 'Wallet disconnected successfully' };
}

module.exports = { connectWallet, getWalletConnection, disconnectWallet };