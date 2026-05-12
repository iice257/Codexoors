import { createRoot } from 'react-dom/client'
import { useMemo, useState } from 'react'
import './style.css'

type StepId = 'identity' | 'tasks' | 'proof' | 'claim'

type Task = {
  id: string
  label: string
  detail: string
}

type Resource = {
  name: string
  kind: string
  detail: string
  status: string
}

const tasks: Task[] = [
  {
    id: 'follow',
    label: 'FOLLOW',
    detail: 'Follow @codexoors and the builders shipping Codex workflows.',
  },
  {
    id: 'rt',
    label: 'RT',
    detail: 'Repost the launch post so other Codex users can find the waitlist.',
  },
  {
    id: 'share',
    label: 'SHARE',
    detail: 'Send your invite link to one operator who actually ships.',
  },
]

const resources: Resource[] = [
  {
    name: 'iMessage Handoff',
    kind: 'Skill',
    detail: 'Remote Codex control through a phone-first handoff loop.',
    status: 'proven',
  },
  {
    name: 'x-publisher',
    kind: 'Skill',
    detail: 'Browser-first X publishing plans for free-account users.',
    status: 'ready',
  },
  {
    name: 'Unfollowr',
    kind: 'Dashboard',
    detail: 'Account hygiene surface for X builders and growth loops.',
    status: 'live',
  },
  {
    name: 'SignalOps',
    kind: 'Demo',
    detail: 'Agentic security/ops cockpit with reusable evidence tracks.',
    status: 'live',
  },
]

const invitedUsers = ['WAITING...', 'WAITING...', 'WAITING...', 'WAITING...', 'WAITING...']

function App() {
  const [handle, setHandle] = useState('')
  const [connected, setConnected] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [selectedResources, setSelectedResources] = useState<string[]>(['iMessage Handoff', 'x-publisher'])
  const [copied, setCopied] = useState(false)

  const invitedBy = useMemo(() => readInviteCode(), [])
  const allTasksDone = completedTasks.length === tasks.length
  const hasProof = selectedResources.length >= 2
  const unlocked = connected && allTasksDone && hasProof
  const inviteCode = unlocked ? createInviteCode(handle || 'codexoor', selectedResources) : '-- -- -- --'
  const inviteLink = `codexoors.fun/?invite=${unlocked ? inviteCode : '-'}`

  const toggleTask = (id: string) => {
    setCompletedTasks((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const toggleResource = (name: string) => {
    setSelectedResources((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
  }

  const copyInvite = async () => {
    if (!navigator.clipboard || !unlocked) {
      return
    }
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="page-shell">
      <section className="launch-card" aria-label="Codexoors early access">
        <header className="topline">
          <a href="https://x.com" target="_blank" rel="noreferrer">
            @codexoors
          </a>
          <span>{onlineCount()} online</span>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <h1>CODEXOORS</h1>
            <p className="subtitle">Early access for people who turned “let me ask Codex” into a lifestyle.</p>
            <div className="hero-meta">
              <strong>Limited spots available</strong>
              <span>Invited by {invitedBy}</span>
            </div>
          </div>
          <div className="room-frame">
            <img src="/codexoor-room.svg" alt="Pixel Codexoor working room" />
            <div className="countdown">
              <span>LIVE IN</span>
              <strong>24HRS</strong>
            </div>
          </div>
        </section>

        <div className="flow-grid">
          <StepCard
            number="1"
            title="CONNECT IDENTITY"
            state={connected ? 'complete' : 'open'}
            help="Connect the public builder identity you want on the waitlist."
          >
            <div className="identity-row">
              <input
                aria-label="X handle"
                onChange={(event) => setHandle(event.target.value)}
                placeholder="@user"
                value={handle}
              />
              <button type="button" onClick={() => setConnected(Boolean(handle.trim()))}>
                {connected ? 'CONNECTED' : 'CONNECT X'}
              </button>
            </div>
            <p className="fineprint">You will be asked to follow @codexoors before launch.</p>
          </StepCard>

          <StepCard
            number="2"
            title="COMMUNITY TASKS"
            state={allTasksDone ? 'complete' : connected ? 'open' : 'locked'}
            help="Complete the three social tasks to unlock your invite."
          >
            <div className="task-row">
              {tasks.map((task) => (
                <button
                  className={completedTasks.includes(task.id) ? 'task done' : 'task'}
                  disabled={!connected}
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  type="button"
                >
                  <strong>{task.label}</strong>
                  <span>{task.detail}</span>
                </button>
              ))}
            </div>
          </StepCard>

          <StepCard
            number="3"
            title="CODEX PROOF"
            state={hasProof ? 'complete' : allTasksDone ? 'open' : 'locked'}
            help="Attach the Codex resources you have shipped or want to bring into the launch."
          >
            <div className="resource-list">
              {resources.map((resource) => (
                <label className="resource" key={resource.name}>
                  <input
                    checked={selectedResources.includes(resource.name)}
                    disabled={!allTasksDone}
                    onChange={() => toggleResource(resource.name)}
                    type="checkbox"
                  />
                  <span>
                    <strong>{resource.name}</strong>
                    <em>
                      {resource.kind} / {resource.status}
                    </em>
                    <small>{resource.detail}</small>
                  </span>
                </label>
              ))}
            </div>
          </StepCard>

          <StepCard
            number="4"
            title={unlocked ? 'REGISTRATION UNLOCKED' : 'REGISTRATION LOCKED'}
            state={unlocked ? 'complete' : 'locked'}
            help={unlocked ? 'Your Codexoor invite is ready.' : 'Finish the previous steps to claim your spot.'}
          >
            <div className="invite-box">
              <span>YOUR INVITE CODE</span>
              <strong>{inviteCode}</strong>
              <button disabled={!unlocked} onClick={copyInvite} type="button">
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <p className="invite-link">{inviteLink}</p>
            <div className="invited-list">
              <span>INVITED USERS (0/5)</span>
              {invitedUsers.map((user, index) => (
                <p key={`${user}-${index}`}>{user}</p>
              ))}
            </div>
          </StepCard>
        </div>
      </section>

      <aside className="meme-panel" aria-label="Codexoor profile">
        <h2>The Codexoor</h2>
        <div className="meme-grid">
          <span>Physically incapable of doing anything manually</span>
          <span>“Codex would have one-shotted this btw...”</span>
          <span>Everything is a workflow to him</span>
          <span>Refers to himself and the assistant as “we”</span>
          <span>Sifts replies for more edge cases to fix</span>
          <span>Noticed your race condition from one stack trace</span>
        </div>
      </aside>
    </main>
  )
}

function StepCard({
  number,
  title,
  help,
  state,
  children,
}: {
  number: string
  title: string
  help: string
  state: 'open' | 'locked' | 'complete'
  children: React.ReactNode
}) {
  return (
    <article className={`step-card ${state}`}>
      <div className="step-index">{number}</div>
      <div className="step-content">
        <div className="step-heading">
          <h2>{title}</h2>
          <span>{state}</span>
        </div>
        <p>{help}</p>
        {children}
      </div>
    </article>
  )
}

function readInviteCode() {
  const params = new URLSearchParams(window.location.search)
  return params.get('invite')?.slice(0, 16).toUpperCase() || 'XXXXX'
}

function createInviteCode(handle: string, selectedResources: string[]) {
  const cleaned = handle.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase() || 'CODEX'
  return `${cleaned}-${selectedResources.length}X`
}

function onlineCount() {
  return 42 + new Date().getMinutes()
}

createRoot(document.getElementById('root')!).render(<App />)
