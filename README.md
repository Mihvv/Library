# System Zarządzania Biblioteką (Library)

## 1. Wprowadzenie

### Opis projektu
Aplikacja jest webowym systemem do zarządzania biblioteką, umożliwiającym zarządzanie książkami, użytkownikami i wypożyczeniami. Rozdzielona jest na frontend i backend.

Użytkownik może rejestrować się w systemie, logować się na swoje konto, przeglądać listę książek, wypożyczać książki, przeglądać swoje wypożyczenia i zwracać książki.

Administrator może przeglądać listę użytkowników oraz usuwać ich, dodawać, usuwać i edytować książki oraz przeglądać listę wszystkich aktywnych wypożyczeń oraz całą historię wypożyczeń.

### Kluczowe funkcje i możliwości
- **Architektura Klient-Serwer**: Pełna separacja logiki biznesowej (API) od warstwy prezentacji.
- **Role użytkowników**: System rozróżnia zwykłych użytkowników (USER) i administratorów (ADMIN) z różnymi poziomami dostępu.
- **Pełna historia**: Śledzenie historii wypożyczeń dla każdego użytkownika i książki.
- **Bezpieczeństwo**: Autentykacja oparta na JWT oraz bezpieczne haszowanie haseł.

## 2. Wykorzystane technologie

**Backend (API):**
- Node.js (ESM) & Express.js 5.2.1 - środowisko uruchomieniowe i framework serwerowy
- TypeScript 5.9.3 - typowanie statyczne
- Prisma ORM 7.1 - komunikacja z bazą danych
- PostgreSQL 18 - relacyjna baza danych
- JWT & bcrypt - autentykacja i bezpieczeństwo
- Swagger UI - dokumentacja API
- Docker - konteneryzacja

**Frontend (Client):**
- Next.js 16.1.2 - framework React (App Router)
- React 19.2.0 - biblioteka interfejsu
- TypeScript 5.x - typowanie statyczne
- NextAuth.js - obsługa sesji po stronie klienta
- Tailwind CSS 4.1 - stylowanie
- Axios - klient HTTP

## 3. Instalacja i Konfiguracja

### Wymagania wstępne

Aby uruchomić projekt, upewnij się, że posiadasz zainstalowane:
- Git
- Docker (wersja >= 24.x) oraz Docker Compose (v2+)
- Opcjonalnie (do uruchamiania bez Dockera): Node.js >= 20.x, npm >= 9.x

### Instrukcje klonowania repozytorium
```bash
git clone https://github.com/Mihvv/Library.git
cd Library
```

### Kroki instalacji - przygotowanie projektu

**1. Konfiguracja zmiennych środowiskowych**

Należy utworzyć dwa pliki `.env` w odpowiednich katalogach:

- Dla Frontendu (`frontend/.env.local`):
```env
API_URL=http://backend:4000/api
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=secret_key
```

- Dla Backendu (`backend/.env`):
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/library
JWT_SECRET=secret_key
```

**2. Uruchomienie w kontenerach Docker**
```bash
docker compose up --build
```

**3. Wgranie przykładowych danych (Seed)**

Po uruchomieniu kontenerów wykonaj polecenie w nowym oknie terminala:
```bash
docker compose exec backend npm run seed
```
Wtedy login na konto admina: admin@library.com; hasło: admin123

## 4. Instrukcje użytkowania

### Lokalne uruchamianie aplikacji

Po wykonaniu kroków instalacyjnych aplikacja jest dostępna pod następującymi adresami:
- **Frontend (Aplikacja)**: http://localhost:3000
- **Backend (Swagger API)**: http://localhost:4000/api/docs
- **Baza danych**: dostępna na porcie 5434 (zmapowana z wewnętrznego 5432)

## 5. Kod i konfiguracja

### Repozytorium GitHub

Kod źródłowy dostępny jest pod adresem: https://github.com/Mihvv/Library.git

### Przykłady konfiguracji

Projekt wykorzystuje plik `docker-compose.yml` do orkiestracji usług. Mapowanie portów:
- Frontend mapuje port kontenera 3000 na host 3000
- Backend mapuje port kontenera 4000 na host 4000
- Baza danych mapuje port kontenera 5432 na host 5434 (aby uniknąć konfliktów z lokalnym Postgres)

Backend i Frontend komunikują się w sieci Dockera używając nazw serwisów (np. `http://backend:4000`), natomiast przeglądarka użytkownika łączy się przez `localhost`.

## 6. Funkcje

### Główne funkcje aplikacji

**Dla Użytkownika:**
- **Rejestracja i Logowanie**: Bezpieczne zakładanie konta i autoryzacja
- **Przeglądanie katalogu**: Wyszukiwanie książek po tytule, autorze lub ISBN z paginacją i sortowaniem
- **Wypożyczanie**: Możliwość wypożyczenia dostępnej książki
- **Panel "Moje wypożyczenia"**: Podgląd aktywnych wypożyczeń i historia zwrotów

**Dla Administratora:**
- **Zarządzanie Książkami**: Dodawanie (z walidacją ISBN), edycja i usuwanie książek
- **Zarządzanie Użytkownikami**: Podgląd listy użytkowników, usuwanie kont
- **Zarządzanie Wypożyczeniami**: Przegląd wszystkich aktywnych i zakończonych wypożyczeń w systemie

### Unikalne i zaawansowane funkcjonalności
- **Middleware Autoryzacji (Frontend & Backend)**: Podwójna ochrona ścieżek. Backend weryfikuje token JWT, a Frontend (Next.js Middleware) chroni widoki `/loans` i `/users`
- **Walidacja DTO**: Backend wykorzystuje class-validator do sprawdzania poprawności danych (np. format ISBN, unikalność email) przed ich przetworzeniem
- **Paginacja i filtrowanie**: Lista książek z opcjami sortowania, wyszukiwania i stronicowania

## 7. Struktura kodu

### 7.1. Model danych - Baza danych

Baza danych PostgreSQL opiera się na trzech głównych encjach zarządzanych przez Prisma ORM. Schemat zdefiniowany w pliku `backend/prisma/schema.prisma`:

#### Encje i relacje

**User (Użytkownik)**
```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  password String
  role     Role    @default(USER)
  loans    Loan[]

  @@map("user")
}

enum Role {
  USER
  ADMIN
}
```
- **Pola**: `id`, `email` (unikalny), `password` (haszowany bcrypt), `role` (domyślnie USER)
- **Relacje**: Jeden użytkownik → wiele wypożyczeń (1:N z Loan)

**Book (Książka)**
```prisma
model Book {
  id     Int     @id @default(autoincrement())
  title  String
  author String
  isbn   String  @unique
  loans  Loan[]

  @@map("book")
}
```
- **Pola**: `id`, `title`, `author`, `isbn` (unikalny)
- **Relacje**: Jedna książka → wiele wypożyczeń (1:N z Loan)
- **Uwaga**: Pole `isAvailable` jest wyliczane dynamicznie po stronie aplikacji (czy istnieje aktywne wypożyczenie)

**Loan (Wypożyczenie)**
```prisma
model Loan {
  id          Int       @id @default(autoincrement())
  userId      Int
  bookId      Int
  borrowedAt  DateTime  @default(now())
  returnDate  DateTime?

  user User @relation(fields: [userId], references: [id])
  book Book @relation(fields: [bookId], references: [id])

  @@map("loan")
}
```
- **Pola**: `id`, `userId`, `bookId`, `borrowedAt` (timestamp wypożyczenia), `returnDate` (null = aktywne wypożyczenie)
- **Relacje**: 
  - Wiele wypożyczeń → jeden użytkownik (N:1 z User)
  - Wiele wypożyczeń → jedna książka (N:1 z Book)

### 7.2 Struktura projektu
```
/
├── frontend/                    # Aplikacja Next.js
│   ├── src/
│   │   ├── app/                 # App Router Next.js
│   │   │   ├── (auth)/          # Grupa routingu dla auth
│   │   │   │   ├── login/       # Strona logowania
│   │   │   │   ├── register/    # Strona rejestracji
│   │   │   │   └── layout.tsx   # Layout dla stron auth
│   │   │   ├── loans/       # Moje wypożyczenia
│   │   │   ├── users/       # Panel administratora
│   │   │   ├── api/
│   │   │   │   └── auth/
│   │   │   │       └── [...nextauth]/
│   │   │   │           └── route.ts  # Konfiguracja NextAuth
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Strona główna (lista książek)
│   │   │   └── providers.tsx    # SessionProvider wrapper
│   │   ├── components/
│   │   │   ├── features/        # Komponenty feature-specific
│   │   │   │   ├── BookModal.tsx
│   │   │   │   └── LoanModal.tsx
│   │   │   └── layout/          # Komponenty layoutu
│   │   │       └── Navbar.tsx
│   │   ├── lib/
│   │   │   ├── axios.ts         # Konfiguracja Axios + interceptory
│   │   │   └── types.ts         # Typy TypeScript (Book, Loan, User)
│   │   ├── types/
│   │   │   └── next-auth.d.ts   # Rozszerzenie typów NextAuth
│   │   └── middleware.ts        # Next.js middleware (ochrona tras)
│   ├── .env               # Zmienne środowiskowe (NEXT_PUBLIC_API_URL)
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # API Express.js + TypeScript
│   ├── prisma/
│   │   └── schema.prisma        # Model danych Prisma
│   ├── src/
│   │   ├── controllers/         # Obsługa żądań HTTP
│   │   │   ├── auth.controller.ts
│   │   │   ├── book.controller.ts
│   │   │   ├── loan.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── services/            # Logika biznesowa
│   │   │   ├── auth.service.ts
│   │   │   ├── book.service.ts
│   │   │   ├── loan.service.ts
│   │   │   └── user.service.ts
│   │   ├── routes/              # Definicje endpointów
│   │   │   ├── auth.routes.ts
│   │   │   ├── book.routes.ts
│   │   │   ├── loan.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── middlewares/         # Middleware Express
│   │   │   ├── auth.middleware.ts      # Weryfikacja JWT
│   │   │   ├── role.middleware.ts      # Sprawdzanie roli ADMIN
│   │   │   └── validation.middleware.ts # Walidacja DTO
│   │   ├── dtos/                # Data Transfer Objects (walidacja)
│   │   │   ├── auth.dto.ts
│   │   │   ├── book.dto.ts
│   │   │   ├── loan.dto.ts
│   │   │   └── user.dto.ts
│   │   ├── prisma/
│   │   │   └── client.ts        # Klient Prisma
│   │   ├── utils/
│   │   │   └── jwt.ts           # Funkcje signToken/verifyToken
│   │   ├── app.ts               # Konfiguracja Express (CORS, routes, Swagger)
│   │   └── index.ts             # Entry point (app.listen)
│   ├── .env                     # Zmienne środowiskowe (DATABASE_URL, JWT_SECRET)
│   ├── openapi.yaml             # Dokumentacja Swagger/OpenAPI
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml           # docker-compose
```
### 7.3. Gdzie znaleźć konkretne funkcjonalności

| Funkcjonalność | Lokalizacja |
|----------------|-------------|
| **Lista książek z paginacją** | Frontend: `app/page.tsx` → Backend: `book.service.ts::getAllBooks()` |
| **Wypożyczenie książki** | Frontend: `components/features/LoanModal.tsx` → Backend: `loan.service.ts::createLoan()` |
| **Zwrot książki** | Frontend: `app/loans/page.tsx` → Backend: `loan.service.ts::returnLoan()` |
| **Dodawanie książki (ADMIN)** | Frontend: `components/features/BookModal.tsx` → Backend: `book.service.ts::createBook()` |
| **Panel administratora** | Frontend: `app/users/page.tsx` → Backend: `user.service.ts`, `loan.service.ts::getAllLoans()` |
| **Rejestracja** | Frontend: `app/(auth)/register/page.tsx` → Backend: `auth.service.ts::register()` |
| **Logowanie** | Frontend: `app/(auth)/login/page.tsx` + `api/auth/[...nextauth]/route.ts` → Backend: `auth.service.ts::login()` |
| **Walidacja ISBN** | Backend: `dtos/book.dto.ts` (dekorator `@IsISBN()`) |
| **Ochrona tras** | Frontend: `middleware.ts`, Backend: `middlewares/auth.middleware.ts` + `role.middleware.ts` |

### 7.4. Główne elementy architektury kodu

#### Backend - Architektura warstwowa (Layered Architecture)

**1. Warstwa Routes (Routing Layer)**
- **Lokalizacja**: `src/routes/*.routes.ts`
- **Odpowiedzialność**: Definiowanie endpointów API, konfiguracja middleware chain
- **Przykład**:
```typescript
// book.routes.ts
router.get('/', getBooks);  // Publiczne - bez middleware
router.post('/', 
  authMiddleware,           // 1. Weryfikacja JWT
  requireAdmin,             // 2. Sprawdzenie roli ADMIN
  validateDto(CreateBookDto), // 3. Walidacja body
  createBook                // 4. Kontroler
);
```

**2. Warstwa Controllers (HTTP Layer)**
- **Lokalizacja**: `src/controllers/*.controller.ts`
- **Odpowiedzialność**: 
  - Obsługa żądań HTTP (Request/Response)
  - Walidacja parametrów URL i query params
  - Mapowanie błędów na kody HTTP (404, 409, 500)
  - Wywołanie odpowiedniego serwisu

**3. Warstwa Services (Business Logic Layer)**
- **Lokalizacja**: `src/services/*.service.ts`
- **Odpowiedzialność**:
  - Logika biznesowa (sprawdzanie dostępności książki, walidacja reguł)
  - Komunikacja z bazą danych przez Prisma ORM
  - Obsługa wyjątków biznesowych (throw new Error)
- **Wzorzec**: Singleton (jedna instancja każdego serwisu)

**4. Warstwa DTOs (Data Transfer Objects)**
- **Lokalizacja**: `src/dtos/*.dto.ts`
- **Odpowiedzialność**:
  - Definicja kontraktów API (struktura requestów/responses)
  - Walidacja danych wejściowych (class-validator decorators)
- **Przykład**:
```typescript
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title!: string;

  @IsISBN()
  isbn!: string;
}
```

**5. Warstwa Middlewares**
- **Lokalizacja**: `src/middlewares/*.middleware.ts`
- **Typy**:
  - `authMiddleware`: Weryfikacja JWT → `req.user = { id, role }`
  - `requireAdmin`: Sprawdzenie `req.user.role === 'ADMIN'`
  - `validateDto`: Walidacja body przez class-validator

**6. Warstwa Prisma (Data Access Layer)**
- **Lokalizacja**: `src/prisma/client.ts`
- **Odpowiedzialność**: Singleton Prisma Client dla komunikacji z PostgreSQL

#### Frontend - Architektura komponentowa (Next.js App Router)

**1. Pages (App Router)**
- **Lokalizacja**: `src/app/*/page.tsx`
- **Odpowiedzialność**: 
  - Główna logika strony (state management, data fetching)
  - Kompozycja komponentów
  - Routing

**2. Components**
- **Layout Components** (`components/layout/`): Navbar - nawigacja globalna
- **Feature Components** (`components/features/`): BookModal, LoanModal - logika modali

**3. Lib (Utilities)**
- `lib/axios.ts`: Konfiguracja HTTP client z interceptorami (auto-dodawanie JWT)
- `lib/types.ts`: Współdzielone typy TypeScript

**4. Middleware**
- `middleware.ts`: Ochrona tras przed nieautoryzowanym dostępem (Next.js Edge Middleware)

#### Przykładowy request/response

**Request:**
```http
POST /api/loans HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "bookId": 5
}
```

**Response (Success - 201):**
```json
{
  "id": 12,
  "userId": 3,
  "bookId": 5,
  "borrowedAt": "2024-01-22T14:30:00.000Z",
  "returnDate": null,
  "book": {
    "id": 5,
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J.K. Rowling",
    "isbn": "978-0439708180"
  }
}
```

**Response (Error - 409 Conflict):**
```json
{
  "message": "Book is already loaned"
}
```

#### Kluczowe mechanizmy bezpieczeństwa w tym przepływie

1. **JWT Authentication**: `authMiddleware` weryfikuje token i odrzuca nieautoryzowane requesty (401)
2. **DTO Validation**: `validateDto` sprawdza typy i wymagalność pól (400 jeśli błąd)
3. **Business Logic Validation**: Serwis sprawdza dostępność książki przed utworzeniem wypożyczenia
4. **Error Handling**: Każda warstwa odpowiednio obsługuje błędy i mapuje je na kody HTTP
5. **Data Integrity**: Prisma zapewnia zgodność z schematem bazy danych