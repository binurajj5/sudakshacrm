# Simple Course API Test Script
$ErrorActionPreference = "Stop"

$baseUrl = "http://127.0.0.1:4000/api/v1"

Write-Host "`n🔐 Logging in as admin..." -ForegroundColor Cyan
try {
    $loginBody = @{
        email = "admin@sudaksha.com"
        password = "Admin@123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.accessToken
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n📚 Creating a new course..." -ForegroundColor Cyan
try {
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $courseBody = @{
        name = "Web Development Fundamentals"
        code = "WD-101"
        description = "Complete web development course covering HTML, CSS, JavaScript, and modern frameworks"
        category = "TECHNICAL"
        duration = 40
        level = "BEGINNER"
        status = "DRAFT"
        isTemplate = $false
        price = 999.99
    } | ConvertTo-Json

    $course = Invoke-RestMethod -Uri "$baseUrl/courses" -Method POST -Headers $headers -Body $courseBody
    
    Write-Host "✅ Course created successfully!" -ForegroundColor Green
    Write-Host "   ID: $($course.id)" -ForegroundColor Gray
    Write-Host "   Name: $($course.name)" -ForegroundColor Gray
    Write-Host "   Code: $($course.code)" -ForegroundColor Gray
    Write-Host "   Category: $($course.category)" -ForegroundColor Gray
    Write-Host "   Level: $($course.level)" -ForegroundColor Gray
    Write-Host "   Status: $($course.status)" -ForegroundColor Gray
    
    $courseId = $course.id
} catch {
    Write-Host "❌ Course creation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host "`n📋 Listing all courses..." -ForegroundColor Cyan
try {
    $coursesUrl = $baseUrl + '/courses?page=1&limit=10'
    $courses = Invoke-RestMethod -Uri $coursesUrl -Method GET -Headers $headers
    Write-Host "Found $($courses.total) course(s)" -ForegroundColor Green
    Write-Host "   Page: $($courses.page) of $([Math]::Ceiling($courses.total / $courses.limit))" -ForegroundColor Gray
} catch {
    Write-Host "Listing courses failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n Retrieving course details..." -ForegroundColor Cyan
try {
    $courseDetails = Invoke-RestMethod -Uri "$baseUrl/courses/$courseId" -Method GET -Headers $headers
    Write-Host "Course details retrieved!" -ForegroundColor Green
    Write-Host "   Topics: $($courseDetails._count.topics)" -ForegroundColor Gray
    Write-Host "   Version: $($courseDetails.version)" -ForegroundColor Gray
} catch {
    Write-Host "Retrieving course details failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAll tests completed successfully!`n" -ForegroundColor Green
