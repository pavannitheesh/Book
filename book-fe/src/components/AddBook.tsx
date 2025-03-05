import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export function AddBook({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genre: '',
    publicationDate: '',
    publisher: '',
    isbn: ''
  });

  const handleChange = (e) => {
    const {id, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [id]: value, 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Book Data:', book);
  };
  
    // const handleSubmit = async (e: { preventDefault: () => void }) => {
    //   e.preventDefault();
  
    //   try {
    //     const response = await fetch('http://localhost:3000/api/auth/signup', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ name, email, password }),
    //     });
  
    //     const data = await response.json();
  
    //     if (!response.ok) {
    //       throw new Error(data.message || 'Signup failed');
    //     }
  
    //     // Save token to localStorage and redirect to home
    //     localStorage.setItem('userInfo', JSON.stringify(data));
    //     navigate('/');
    //   } catch (err) {
    //     setError((err as Error).message);
    //   }

    // };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 ">
    <div className="w-full max-w-sm">
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-3 ">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="abc"
                required
                value={book.title}
                onChange={handleChange}
           
              />
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                value={book.author}
                onChange={handleChange}
                placeholder="abc"
                required
              />
               <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="This story starts as"
                value={book.description}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Book
            </Button>
          </div>
          
         
        </div>
      </form>
      
    </div>
    </div>
    </div>
  )
}
