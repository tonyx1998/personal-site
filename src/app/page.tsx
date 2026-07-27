import PortfolioHome from "@/components/PortfolioHome";
import {
  personJsonLd,
  websiteJsonLd,
  jsonLdScriptProps,
} from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script {...jsonLdScriptProps(personJsonLd)} />
      <script {...jsonLdScriptProps(websiteJsonLd)} />
      <PortfolioHome />
    </>
  );
}
