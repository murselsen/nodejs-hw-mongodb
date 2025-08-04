# Environment Variable Utility

## Açıklama

Bu modül, Node.js uygulamalarında çevre değişkenlerini (environment variables) güvenli ve kolay bir şekilde yönetmek için geliştirilmiş bir yardımcı fonksiyondur.

## Özellikler

- **Otomatik .env dosyası yükleme**: `dotenv` kütüphanesi ile `.env` dosyasındaki değişkenleri otomatik olarak yükler
- **Varsayılan değer desteği**: Çevre değişkeni bulunamazsa kullanılacak varsayılan değer belirleyebilirsiniz
- **Hata yönetimi**: Zorunlu değişkenler eksikse açıklayıcı hata mesajları verir
- **Tip güvenliği**: ES6 modül sistemi ile export edilir

## Kod Yapısı

```javascript
import dotenv from 'dotenv';
dotenv.config();

export const env = (name, defaultValue) => {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}']`);
};
```

## Parametreler

| Parametre      | Tip      | Zorunlu | Açıklama                                           |
| -------------- | -------- | ------- | -------------------------------------------------- |
| `name`         | `string` | ✅      | Okunmak istenen çevre değişkeninin adı             |
| `defaultValue` | `any`    | ❌      | Değişken bulunamazsa kullanılacak varsayılan değer |

## Dönüş Değerleri

- **String**: Çevre değişkeninin değeri (eğer mevcutsa)
- **Any**: Varsayılan değer (eğer çevre değişkeni bulunamazsa)
- **Error**: Hem çevre değişkeni hem varsayılan değer yoksa hata fırlatır

## Kullanım Örnekleri

### Varsayılan değer ile kullanım

```javascript
import { env } from './utils/env.js';

// MongoDB port numarası - varsayılan olarak 27017 kullanır
const mongoPort = env('MONGO_PORT', '27017');

// Uygulama portu - varsayılan olarak 3000 kullanır
const appPort = env('PORT', 3000);
```

### Zorunlu değişken kullanımı

```javascript
// API anahtarı - zorunlu, yoksa hata fırlatır
const apiKey = env('API_KEY');

// Veritabanı URL'i - zorunlu
const databaseUrl = env('DATABASE_URL');
```

### Ortam bilgisi

```javascript
// Uygulama ortamı - varsayılan olarak development
const nodeEnv = env('NODE_ENV', 'development');
```

## Avantajları

1. **Güvenlik**: Hassas bilgilerin kodda sabit olarak yazılmasını önler
2. **Esneklik**: Farklı ortamlarda farklı yapılandırmalar kullanılabilir
3. **Hata Önleme**: Eksik zorunlu değişkenler için erken uyarı verir
4. **Basitlik**: Tek bir fonksiyon ile tüm çevre değişkeni ihtiyaçları karşılanır

## Gereksinimler

- Node.js
- `dotenv` npm paketi
- Proje kök dizininde `.env` dosyası (opsiyonel)

## .env Dosyası Örneği

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017/myapp
MONGO_PORT=27017

# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys
JWT_SECRET=your-secret-key
API_KEY=your-api-key
```
