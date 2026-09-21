Add-Type -AssemblyName System.Speech

$outputDir = Join-Path $PSScriptRoot '..\public\assets\family-archive\audio'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$memories = @(
  @{
    File = '01-first-family-climb.wav'
    Voice = 'Microsoft Huihui Desktop'
    Rate = -1
    Text = '我小时候第一次跟家里人爬华山，大家走得很慢，却一路都在讲以前来这里的故事。旧照片里的石阶和山风，好像把不同年代的我们连在了一起。'
  },
  @{
    File = '02-lotus-lantern-game-night.wav'
    Voice = 'Microsoft Kangkang'
    Rate = 0
    Text = '每次从华山回来，我们都会围在桌边继续讲宝莲灯。有时我们用卡片重新安排故事，有时争论哪一段最勇敢。桌游让登山结束以后，故事还可以继续。'
  },
  @{
    File = '03-trail-cat-note.wav'
    Voice = 'Microsoft Yaoyao'
    Rate = 1
    Text = '今天在山路边遇到一只很好看的小猫咪。它一点都不怕人，站在石头旁边看了我们很久，也成了这次登山里最意外的一段记忆。'
  }
)

foreach ($memory in $memories) {
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice($memory.Voice)
  $synth.Rate = $memory.Rate
  $path = Join-Path $outputDir $memory.File
  $synth.SetOutputToWaveFile($path)
  $synth.Speak($memory.Text)
  $synth.Dispose()
  Write-Output $path
}
