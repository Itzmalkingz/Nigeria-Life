import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui'

export default function PlaceholderPage({ title, description, icon = '🚧' }: { title: string; description: string; icon?: string }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="text-6xl" aria-hidden="true">{icon}</div>
        <h1 className="heading-display text-display-lg">{title}</h1>
        <p className="text-body text-muted-text">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This feature is planned for a future milestone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-body text-muted-text" role="list">
            <li className="flex items-center gap-2">✅ Landing page & auth</li>
            <li className="flex items-center gap-2">✅ Game shell & navigation</li>
            <li className="flex items-center gap-2">⏳ Gameplay systems (M3+)</li>
            <li className="flex items-center gap-2">⏳ This feature</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}