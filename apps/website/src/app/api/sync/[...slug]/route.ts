import { syncFolgen } from "@ddfdb/legacy-api";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return new NextResponse("No App Key provided", { status: 401 });
  }

  const { CRON_SECRET } = process.env;
  const token = authorization.split(" ")[1];

  if (token !== CRON_SECRET) {
    return new NextResponse("Invalid App Key provided", { status: 401 });
  }

  const { slug } = await params;
  const [action] = slug;

  try {
    if (action === "folgen") {
      const result = await syncFolgen();
      revalidateTag("folgen-list", "max");
      return NextResponse.json(result);
    }

    return new NextResponse(null, { status: 404 });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, { status: 500 });
  }
}

// Vercel cron jobs invoke their target path with GET, so the sync actions have
// to be reachable via GET as well. POST is kept for manual/local invocation.
export { handler as GET, handler as POST };
