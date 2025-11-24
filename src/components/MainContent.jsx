export default function MainContent({ children }) {
    return (
      <main className="flex-1 pt-16 pb-8 px-4 md:px-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    );
  }