# Update ALL .tsx files in src with light theme color replacements
$allFiles = Get-ChildItem -Path 'D:\vama2\Smart-supply-Chain-main\src' -Recurse -Filter '*.tsx' | Select-Object -ExpandProperty FullName

$count = 0
foreach ($file in $allFiles) {
    $content = Get-Content $file -Raw -Encoding UTF8
    $original = $content

    # Dark page backgrounds
    $content = $content.Replace('min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950', 'min-h-screen bg-[#F2EFE7]')
    $content = $content.Replace('min-h-screen bg-[#080B12]', 'min-h-screen bg-[#F2EFE7]')
    $content = $content.Replace('"bg-[#080B12]"', '"bg-[#F2EFE7]"')

    # Dark grid patterns
    $content = $content.Replace('bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]', 'dot-pattern')
    $content = $content.Replace('bg-[linear-gradient(to_right,#33646815_1px,transparent_1px),linear-gradient(to_bottom,#33646815_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]', 'dot-pattern')

    # Logo brightness filter (invert for dark) - only when on dark bg (avoid breaking)
    # $content = $content.Replace('brightness-0 invert', '')  # Do NOT do globally

    # bg-slate-950 
    $content = $content.Replace('bg-slate-950', 'bg-[#F2EFE7]')
    $content = $content.Replace('bg-slate-950/85', 'bg-white/90')

    # Remaining text color patterns in SupplyType/OrderId step modals and supplier dashboard
    $content = $content.Replace('"bg-white rounded-2xl border border-[rgba(139,0,74,0.1)]"', '"bg-white rounded-2xl"')

    # SupplierDashboard Card & inputs already done, but fix StarRating
    $content = $content.Replace('text-white/15"', 'text-gray-200"')
    $content = $content.Replace('text-white/60 text-xs ml-1.5', 'text-gray-500 text-xs ml-1.5')
    $content = $content.Replace('text-white/80"', 'text-[#1a1a1a]"')
    $content = $content.Replace('"text-white font-medium"', '"text-[#1a1a1a] font-medium"')
    $content = $content.Replace('"text-white font-semibold"', '"text-[#1a1a1a] font-semibold"')
    $content = $content.Replace('"text-white font-bold"', '"text-[#1a1a1a] font-bold"')
    $content = $content.Replace('"text-white text-sm font-medium"', '"text-[#1a1a1a] text-sm font-medium"')
    $content = $content.Replace('"text-white text-sm"', '"text-[#1a1a1a] text-sm"')
    $content = $content.Replace('"text-white text-lg font-semibold"', '"text-[#1a1a1a] text-lg font-semibold"')
    $content = $content.Replace(' text-white text-sm font-mono"', ' text-[#1a1a1a] text-sm font-mono"')
    $content = $content.Replace('"text-2xl font-bold text-white"', '"text-2xl font-bold text-[#1a1a1a]"')
    $content = $content.Replace('"text-xl font-semibold text-white"', '"text-xl font-semibold text-[#1a1a1a]"')
    $content = $content.Replace('"text-lg font-semibold text-white"', '"text-lg font-semibold text-[#1a1a1a]"')
    $content = $content.Replace('"text-lg font-bold text-white"', '"text-lg font-bold text-[#1a1a1a]"')
    $content = $content.Replace('"text-sm font-semibold text-white"', '"text-sm font-semibold text-[#1a1a1a]"')
    $content = $content.Replace('"text-white text-xl font-semibold"', '"text-[#1a1a1a] text-xl font-semibold"')
    $content = $content.Replace('"text-white text-2xl font-bold"', '"text-[#1a1a1a] text-2xl font-bold"')

    # Headings in modal onboarding steps (SupplyTypeStep, OrderIdStep)
    $content = $content.Replace('"text-2xl font-bold text-white mb-2"', '"text-2xl font-bold text-[#1a1a1a] mb-2"')
    $content = $content.Replace('text-blue-200/50 text-sm"', 'text-[#9ca3af] text-sm"')

    # progress bars still on dark bg
    $content = $content.Replace('bg-white/10 overflow-hidden"', 'bg-[#F2EFE7] overflow-hidden border border-[rgba(139,0,74,0.08)]"')
    $content = $content.Replace('"bg-white/10"', '"bg-[#EDE9E1]"')

    # Map dark background for supplier shipment map
    $content = $content.Replace('from-[#F2EFE7] via-[#E8E4DA] to-[#F2EFE7]', 'from-[#F9F7F2] via-[#EDE9E1] to-[#F9F7F2]')

    # Remove old blue dot for unread notifications  
    $content = $content.Replace('bg-blue-500/[0.04]', 'bg-[rgba(139,0,74,0.04)]')
    $content = $content.Replace('bg-blue-500/15', 'bg-[rgba(139,0,74,0.1)]')
    $content = $content.Replace('text-blue-200"', 'text-[#8B004A]"')

    # violet gradient -> murrey
    $content = $content.Replace('from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600', 'from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A]')
    $content = $content.Replace('bg-gradient-to-br from-violet-500 to-purple-500', 'bg-gradient-to-br from-[#8B004A] to-[#C4006A]')
    $content = $content.Replace('shadow-violet-500/25', 'shadow-[#8B004A]/25')
    $content = $content.Replace('shadow-violet-500/20', 'shadow-[#8B004A]/20')
    $content = $content.Replace('text-violet-400"', 'text-[#8B004A]"')    
    $content = $content.Replace('bg-violet-500/15', 'bg-[rgba(139,0,74,0.08)]')

    # inputCls remaining references
    $content = $content.Replace('bg-white/5 border-white/10 text-white placeholder:text-blue-200/40 focus:border-blue-400/50 focus:ring-blue-400/20', 'bg-white border-[rgba(139,0,74,0.15)] text-[#1a1a1a] placeholder:text-[#9ca3af]')
    $content = $content.Replace('bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-400/50 focus:ring-blue-400/20', 'bg-white border-[rgba(139,0,74,0.15)] text-[#1a1a1a] placeholder:text-[#9ca3af]')
    $content = $content.Replace('bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20', 'bg-white border-[rgba(139,0,74,0.15)] text-[#1a1a1a] placeholder:text-[#9ca3af]')

    if ($content -ne $original) {
        Set-Content $file -Value $content -Encoding UTF8 -NoNewline
        $count++
    }
}

Write-Host "Updated $count files."
