const express = require('express');
const cors = require('cors');
const { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram } = require('@solana/web3.js');

const app = express();
const port = 3000;

// CORS ayarları
app.use(cors());

// Solana bağlantısı oluşturma
const connection = new Connection('https://api.devnet.solana.com', "confirmed");

app.use(express.json()); // JSON verileri işlemek için body-parser eklentisini kullanıyoruz.

app.post('/sendTransaction', async (req, res) => {
    try {
        // Gönderen cüzdan adresi
        // Özel anahtarınızı buraya atayın
        const secret = [56,155,173,243,127,57,239,251,111,169,191,99,80,42,209,102,32,169,179,21,98,220,214,53,121,85,188,115,230,145,254,16,44,76,162,161,142,1,197,172,13,89,150,133,132,4,11,85,68,241,227,190,175,213,164,111,255,235,199,218,164,212,188,226] // Replace with your secret key

        const from = Keypair.fromSecretKey(new Uint8Array(secret));

        // Alıcı cüzdan adresi
        const toWallet = new PublicKey(req.body.toWallet);

        console.log(from)
        // Transfer miktarı
        const lamports = 1e9; //100000 Örneğin, 0.001 SOL
        const amountInLamports = float(Number(req.body.amountInLamports)); // body den gelen tutarı kabul etmiyor


        console.log(req.body); // Eklenen satır

        // Transfer işlemi oluşturma
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: toWallet,
                lamports,
            })
        );

        // Transfer işlemi gönderme
        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);


        res.send(`İşlem başarıyla gönderildi. İmza: ${signature}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('İşlem gönderirken bir hata oluştu');
    
    }
});

app.listen(port, () => {
    console.log(`Uygulama ${port} numaralı portta çalışıyor`);
});
