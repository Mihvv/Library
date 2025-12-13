"use client";

import BookForm, { BookFormData } from "@/components/BookForm";

type Props = {
  params: {
    id: string;
  };
};

export default function EditBookPage({ params }: Props) {
  const existingBook: BookFormData = {
    title: "Infinite Jest",
    author: "David Foster Wallace",
    isbn: " 9780316920049 ",
  };

  const handleSubmit = (data: BookFormData) => {
    console.log(`EDYCJA KSIĄŻKI ID=${params.id}`, data);

    // docelowo:
    // axios.put(`/api/books/${params.id}`, data);
  };

  return (
    <div className="container mt-4">
      <h1>Edycja książki (ID: {params.id})</h1>

      <BookForm
        mode="edit"
        initialData={existingBook}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
