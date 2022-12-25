import { TootSection } from "./components/TootSection"
import { EmojisProvider } from "./components/EmojisProvider.jsx"
import Layout from "./components/layout"

function IndexPage() {
  return (
    <Layout>
      <EmojisProvider>
        <TootSection />
      </EmojisProvider>
    </Layout>
  )
}

export default IndexPage
