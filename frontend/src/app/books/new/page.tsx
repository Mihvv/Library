"use client";

import BookForm, { BookFormData } from "@/components/BookForm";

export default function NewBookPage() {
  const handleSubmit = (data: BookFormData) => {
    console.log("DODAWANIE KSIĄŻKI:", data);

    // docelowo:
    // axios.post("/api/books", data);
  };

  return (
    <div className="container mt-4">
      <h1>Dodaj nową książkę</h1>

      <BookForm mode="add" onSubmit={handleSubmit} />
    </div>
  );
}
