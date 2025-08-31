import React from 'react'

interface SidebarContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  const value = React.useMemo(() => ({ open, setOpen, toggle: () => setOpen(v => !v) }), [open])
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider')
  return ctx
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()
  return (
    <aside
      className={
        `h-screen sticky top-0 border-r border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-2xl transition-[width] duration-200 ` +
        (open ? 'w-64' : 'w-16')
      }
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return <div className="p-4 border-b border-white/10">{children}</div>
}

export function SidebarFooter({ children }: { children?: React.ReactNode }) {
  return <div className="p-4 border-t border-white/10 mt-auto">{children}</div>
}

export function SidebarContent({ children }: { children?: React.ReactNode }) {
  return <div className="p-2 overflow-y-auto h-[calc(100vh-8rem)]">{children}</div>
}

export function SidebarGroup({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={"px-2 py-3 " + (className || '')}>{children}</div>
}

export function SidebarGroupLabel({ children }: { children?: React.ReactNode }) {
  return <div className="px-2 text-xs uppercase tracking-wider text-gray-300 mb-2">{children}</div>
}

export function SidebarGroupContent({ children }: { children?: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

export function SidebarMenu({ children }: { children?: React.ReactNode }) {
  return <ul className="space-y-1 list-none p-1">{children}</ul>
}

export function SidebarMenuItem({ children }: { children?: React.ReactNode }) {
  return <li>{children}</li>
}

export function SidebarMenuButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-left">
      {children}
    </button>
  )
}

export function SidebarTrigger({ children }: { children?: React.ReactNode }) {
  const { toggle } = useSidebar()
  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 hover:bg-white/10">
      {children || 'Toggle'}
    </button>
  )
}


