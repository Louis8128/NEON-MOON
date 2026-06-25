import { redirect } from "next/navigation";

export default function NewBlogPostRedirectPage() {
  redirect("/blog/admin/new");
}
