import DOMPurify from "dompurify";

console.log(DOMPurify.sanitize("<script>alert('hello')</script>"));
