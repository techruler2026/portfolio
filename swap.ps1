$file = "c:\Users\CHANDHAN\Desktop\portfolio\index.html"
$content = [System.IO.File]::ReadAllText($file)

# 1. Rename About Us to About Me
$content = $content.Replace(">About Us<", ">About Me<")

# 2. Swap Services and About Me sections
$servicesStartMarker = "  <!-- ===================== SERVICES SECTION ===================== -->"
$aboutStartMarker = "  <!-- ===================== ABOUT SECTION ===================== -->"
$experienceStartMarker = "  <!-- ===================== EXPERIENCE SECTION ===================== -->"

$servicesStart = $content.IndexOf($servicesStartMarker)
$aboutStart = $content.IndexOf($aboutStartMarker)
$experienceStart = $content.IndexOf($experienceStartMarker)

if ($servicesStart -ne -1 -and $aboutStart -ne -1 -and $experienceStart -ne -1) {
    $servicesBlock = $content.Substring($servicesStart, $aboutStart - $servicesStart)
    $aboutBlock = $content.Substring($aboutStart, $experienceStart - $aboutStart)
    
    $beforeServices = $content.Substring(0, $servicesStart)
    $afterAbout = $content.Substring($experienceStart)
    
    # Swap them
    $newContent = $beforeServices + $aboutBlock + $servicesBlock + $afterAbout
    [System.IO.File]::WriteAllText($file, $newContent)
    Write-Host "Successfully swapped and renamed!"
} else {
    Write-Host "Could not find section markers."
}
