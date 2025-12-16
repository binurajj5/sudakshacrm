# Test Courses API
Write-Host "`n=== Testing Course Management API ===`n" -ForegroundColor Cyan

# Login
Write-Host "1. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@sudaksha.com"
    password = "Test@123"
} | ConvertTo-Json

try {
    $auth = Invoke-RestMethod -Uri "http://127.0.0.1:4000/api/v1/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    Write-Host "   ✅ Logged in as: $($auth.user.email) ($($auth.user.role))`n"
    $headers = @{
        Authorization = "Bearer $($auth.accessToken)"
    }
} catch {
    Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create Course
Write-Host "2. Creating course..." -ForegroundColor Yellow
$courseBody = @{
    name = "Full Stack Web Development 2025"
    code = "FSWD-2025"
    description = "Complete full stack bootcamp"
    category = "TECHNICAL"
    duration = 120
    level = "INTERMEDIATE"
    status = "DRAFT"
    isTemplate = $true
    price = 49999.99
} | ConvertTo-Json

try {
    $course = Invoke-RestMethod -Uri "http://127.0.0.1:4000/api/v1/courses" `
        -Method POST `
        -Headers $headers `
        -Body $courseBody `
        -ContentType "application/json"
    
    Write-Host "   ✅ Course created:"
    Write-Host "      Name: $($course.name)"
    Write-Host "      Code: $($course.code)"
    Write-Host "      ID: $($course.id)`n"
    $courseId = $course.id
} catch {
    Write-Host "   ❌ Course creation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# List Courses
Write-Host "3. Listing courses..." -ForegroundColor Yellow
try {
    $courses = Invoke-RestMethod -Uri "http://127.0.0.1:4000/api/v1/courses" `
        -Method GET `
        -Headers $headers
    
    Write-Host "   ✅ Found $($courses.meta.total) course(s)`n"
} catch {
    Write-Host "   ❌ List failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Get Course Details
Write-Host "4. Getting course details..." -ForegroundColor Yellow
try {
    $detail = Invoke-RestMethod -Uri "http://127.0.0.1:4000/api/v1/courses/$courseId" `
        -Method GET `
        -Headers $headers
    
    Write-Host "   ✅ Retrieved: $($detail.name)"
    Write-Host "      Topics: $($detail._count.topics)`n"
} catch {
    Write-Host "   ❌ Get failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Tests Complete ===`n" -ForegroundColor Green
