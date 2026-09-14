import { Metadata } from "next";
import { MOCK_CANDIDATES } from "@/lib/mockData";
import { CertificateGate } from "./CertificateGate";

interface Props {
  params: Promise<{ rollNo: string }>; // Updated to Promise based on Next.js 15+ conventions
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rollNo } = await params;
  const candidate = MOCK_CANDIDATES.find((c) => c.rollNo === rollNo);

  if (!candidate) {
    return {
      title: "Certificate Not Found | The Living Credential",
    };
  }

  return {
    title: `${candidate.name}'s Certificate | The Living Credential`,
    description: `View the Living Credential for ${candidate.name} - ${candidate.examName}. Score: ${candidate.score}/${candidate.maxScore}.`,
    openGraph: {
      title: `${candidate.name}'s Digital Credential`,
      description: `View ${candidate.name}'s journey and achievement for ${candidate.examName}.`,
      type: "website",
      images: [
        {
          url: `/api/og?rollNo=${rollNo}`, // In a real app we'd have an OG image endpoint, we'll mock the tag here
          width: 1200,
          height: 630,
          alt: "Certificate Preview",
        },
      ],
    },
  };
}

export default async function CertificatePage({ params }: Props) {
  const { rollNo } = await params;
  const candidate = MOCK_CANDIDATES.find((c) => c.rollNo === rollNo) ?? null;

  // "Not found" (no such roll number) and "not yet claimed" (record exists,
  // claim step hasn't happened) are distinct states — the gate below renders
  // each one separately instead of collapsing them into one generic 404.
  // A candidate already marked `claimed` in mock data renders server-side
  // with zero client interaction required; a candidate claimed only via
  // localStorage upgrades to the certificate view once the client mounts.
  return <CertificateGate candidate={candidate} rollNo={rollNo} />;
}
