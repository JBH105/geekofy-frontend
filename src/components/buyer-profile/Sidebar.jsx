export default function Sidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "basic-information", label: "Basic Information" },
    { id: "invoices", label: "Invoices" },
    { id: "favourites", label: "Favourites" },
    { id: "password", label: "Password" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <aside className="w-[250px] h-[290px] bg-[#00000008] rounded-lg shadow-sm border border-[#DFDFDF]">
      <ul className="space-y-1 py-[10px]">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left pl-11 px-4 py-3 text-xl text-[#333333] leading-6 tracking-[0.2px] cursor-pointer outline-none ${
                activeSection === section.id
                  ? "bg-[#0084FF] text-white cup"
                  : ""
              }`}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
