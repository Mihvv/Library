"use client";

import { useState } from "react";

export type BookFormData = {
  title: string;
  author: string;
  isbn: string;
};

type Props = {
  initialData?: BookFormData;
  onSubmit: (data: BookFormData) => void;
  mode: "add" | "edit";
};

export default function BookForm({ initialData, onSubmit, mode }: Props) {
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title ?? "",
    author: initialData?.author ?? "",
    isbn: initialData?.isbn ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label className="form-label">Tytuł</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Autor</label>
        <input
          type="text"
          name="author"
          className="form-control"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">ISBN</label>
        <input
          type="text"
          name="isbn"
          className="form-control"
          value={formData.isbn}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-success me-2">
        {mode === "add" ? "Dodaj książkę" : "Zapisz zmiany"}
      </button>

      <a href="/books" className="btn btn-secondary">
        Anuluj
      </a>
    </form>
  );
}
