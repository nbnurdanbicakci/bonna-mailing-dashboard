# Bonna · Mayıs 2026 Mailing Dashboard

AfterFAANG tarafından Bonna için hazırlanan, 11 mailing içeren konu odaklı mailing planı dashboard'u. TR/EN içerik metinleri, hedef veri segmentleri (TR Bayi, TR Web, Global Bayi, Global Web) ve her mailing için manuel yorum alanları içerir.

## İçindekiler

```
bonna-mailing-dashboard/
├── public/
│   └── index.html       # Dashboard (tek dosya, kendine yeter)
├── server.js            # Minimal Express statik sunucu
├── package.json         # Node bağımlılıkları
├── railway.json         # Railway deploy konfigürasyonu
├── .gitignore
└── README.md
```

## Yerel çalıştırma

```bash
npm install
npm start
```

Tarayıcıdan `http://localhost:3000` adresinden açın.

## GitHub'a yükleme

```bash
cd bonna-mailing-dashboard
git init
git add .
git commit -m "Bonna Mayıs 2026 mailing dashboard"
git branch -M main
git remote add origin https://github.com/<kullanici>/<repo-adi>.git
git push -u origin main
```

## Railway'e deploy

1. [railway.app](https://railway.app) adresinde hesabınızla girin.
2. Sağ üstten **New Project → Deploy from GitHub repo**'yu seçin.
3. Yeni push'ladığınız repo'yu seçin.
4. Railway otomatik olarak Nixpacks ile Node.js projesini tanır, `npm install` ve `npm start` çalıştırır.
5. Proje açıldıktan sonra **Settings → Networking → Generate Domain** ile herkese açık bir adres alın.
6. Her `git push` sonrası Railway otomatik yeniden deploy eder.

`PORT` ortam değişkeni Railway tarafından otomatik atanır; ekstra ayar gerekmez.

## Notlar (yorum alanı) hakkında

Her mailing kartının altında "Yorumlar & notlar" başlıklı bir metin alanı vardır. Yazılan notlar tarayıcının `localStorage`'ına otomatik kaydedilir.

- **Kalıcılık:** Aynı tarayıcı + aynı domain'de kalır. Tarayıcı temizlenirse silinir.
- **Notları indir:** Sayfa başındaki **Notları indir** butonu tüm yorumları JSON dosyası olarak indirir.
- **Notları içe aktar:** İndirilen JSON dosyasını başka bir cihaza yüklemek için **Notları içe aktar** kullanılır.
- **Temizle:** Tüm yorumları silmek için **Temizle** butonu (onay sorar).

Ekip içinde paylaşmak için: birinin indirdiği JSON dosyasını diğer kişi içe aktarabilir. (İleride backend tabanlı paylaşımlı yorum istenirse server.js genişletilebilir.)

## İçerik güncelleme

Tüm içerik `public/index.html` içindedir. Mailing içeriklerinde değişiklik yapmak için:

1. `public/index.html` dosyasını metin editöründe açın.
2. İlgili `<article class="card" id="mXX">` bloğunu bulun.
3. Konu satırı, mail metni, CTA, hedef segment ve koleksiyon etiketlerini güncelleyin.
4. `git add . && git commit -m "..." && git push` ile Railway'e otomatik yansır.

## Lisans

Bu proje yalnızca Bonna iletişim planı içindir.
