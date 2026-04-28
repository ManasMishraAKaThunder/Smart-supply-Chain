$dashFiles = Get-ChildItem -Path 'D:\vama2\Smart-supply-Chain-main\src\app\pages\dashboards' -Recurse -Filter '*.tsx' | Select-Object -ExpandProperty FullName

foreach ($file in $dashFiles) {
    $content = Get-Content $file -Raw -Encoding UTF8

    # Card component - dark glass to white
    $content = $content.Replace('bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10', 'bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)]')

    # Text colors
    $content = $content.Replace('text-blue-200/60', 'text-[#6b6b6b]')
    $content = $content.Replace('text-blue-200/50', 'text-[#9ca3af]')
    $content = $content.Replace('text-blue-200/40', 'text-[#9ca3af]')
    $content = $content.Replace('text-blue-200/30', 'text-[#b0a8b0]')
    $content = $content.Replace('text-blue-200/25', 'text-[#c4b5c0]')
    $content = $content.Replace('text-blue-300', 'text-[#8B004A]')
    $content = $content.Replace('text-blue-400', 'text-[#8B004A]')
    $content = $content.Replace(' text-white"', ' text-[#1a1a1a]"')
    $content = $content.Replace('>text-white ', '>text-[#1a1a1a] ')

    # Border colors
    $content = $content.Replace('border-white/10', 'border-[rgba(139,0,74,0.1)]')
    $content = $content.Replace('border-white/5 ', 'border-[rgba(139,0,74,0.07)] ')
    $content = $content.Replace('border-white/20', 'border-[rgba(139,0,74,0.2)]')

    # Backgrounds
    $content = $content.Replace('bg-white/[0.04]', 'bg-[#F9F7F2]')
    $content = $content.Replace('bg-white/[0.03]', 'bg-[#F9F7F2]')
    $content = $content.Replace('bg-white/5 border', 'bg-white border')
    $content = $content.Replace('bg-white/5 ', 'bg-white ')
    $content = $content.Replace('hover:bg-white/10 ', 'hover:bg-[#F2EFE7] ')
    $content = $content.Replace('hover:bg-white/[0.04]', 'hover:bg-[#F2EFE7]')
    $content = $content.Replace('hover:bg-white/[0.03]', 'hover:bg-[#F2EFE7]')

    # Blue gradient buttons -> Murrey
    $content = $content.Replace('from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600', 'from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A]')
    $content = $content.Replace('bg-gradient-to-r from-blue-500 to-cyan-500', 'bg-gradient-to-r from-[#8B004A] to-[#C4006A]')
    $content = $content.Replace('bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-[#8B004A] to-[#C4006A]')
    $content = $content.Replace('shadow-blue-500/15', 'shadow-[#8B004A]/15')
    $content = $content.Replace('shadow-blue-500/25', 'shadow-[#8B004A]/25')
    $content = $content.Replace('shadow-blue-500/20', 'shadow-[#8B004A]/20')

    # Dark modal backgrounds
    $content = $content.Replace('bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10', 'bg-white rounded-2xl border border-[rgba(139,0,74,0.1)]')
    $content = $content.Replace('bg-slate-900/95', 'bg-white')
    $content = $content.Replace('bg-black/70 backdrop-blur-sm', 'bg-black/25 backdrop-blur-sm')

    # Map dark background
    $content = $content.Replace('from-slate-900 via-blue-950/50 to-slate-900', 'from-[#F2EFE7] via-[#E8E4DA] to-[#F2EFE7]')

    # Chart axes
    $content = $content.Replace('stroke="rgba(255,255,255,0.07)"', 'stroke="rgba(139,0,74,0.08)"')
    $content = $content.Replace('stroke="rgba(255,255,255,0.4)"', 'stroke="rgba(26,26,26,0.4)"')
    $content = $content.Replace('stroke="#3b82f6"', 'stroke="#8B004A"')
    $content = $content.Replace('stroke="#10b981"', 'stroke="#C4006A"')
    $content = $content.Replace('fill="#3b82f6"', 'fill="#8B004A"')
    $content = $content.Replace('fill="#10b981"', 'fill="#059669"')

    Set-Content $file -Value $content -Encoding UTF8 -NoNewline
}

Write-Host 'Done updating dashboard files.'
