# Test Authentication Flow

Write-Host "🧪 Testing Sudaksha CRM Authentication" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000/api/v1"

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: " -NoNewline -ForegroundColor Green
    Write-Host "$($health.status) - $($health.service)" -ForegroundColor White
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Register Admin User
Write-Host "2️⃣ Registering Admin User..." -ForegroundColor Yellow
$registerBody = @{
    email = "admin@sudaksha.com"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "User"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ User Registered Successfully" -ForegroundColor Green
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor White
    Write-Host "   Role: $($registerResponse.user.role)" -ForegroundColor White
    $accessToken = $registerResponse.accessToken
    $refreshToken = $registerResponse.refreshToken
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  User already exists, attempting login..." -ForegroundColor Yellow
        
        # Test 3: Login
        $loginBody = @{
            email = "admin@sudaksha.com"
            password = "Admin123!"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
            Write-Host "✅ Login Successful" -ForegroundColor Green
            $accessToken = $loginResponse.accessToken
            $refreshToken = $loginResponse.refreshToken
        } catch {
            Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Test 4: Get Current User
Write-Host "3️⃣ Testing 'Get Current User' (Protected Route)..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $accessToken"
}

try {
    $currentUser = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers
    Write-Host "✅ Current User Retrieved" -ForegroundColor Green
    Write-Host "   Name: $($currentUser.firstName) $($currentUser.lastName)" -ForegroundColor White
    Write-Host "   Email: $($currentUser.email)" -ForegroundColor White
    Write-Host "   Role: $($currentUser.role)" -ForegroundColor White
} catch {
    Write-Host "❌ Get Current User Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Refresh Token
Write-Host "4️⃣ Testing Token Refresh..." -ForegroundColor Yellow
$refreshBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $refreshResponse = Invoke-RestMethod -Uri "$baseUrl/auth/refresh" -Method POST -Body $refreshBody -ContentType "application/json"
    Write-Host "✅ Token Refreshed Successfully" -ForegroundColor Green
    $newAccessToken = $refreshResponse.accessToken
} catch {
    Write-Host "❌ Token Refresh Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Authentication Tests Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
