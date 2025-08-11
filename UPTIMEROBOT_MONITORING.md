# UptimeRobot Monitoring Setup

## Overview
Both backend services are optimized for UptimeRobot monitoring with enhanced health endpoints that provide comprehensive system status.

## Monitoring Configuration

### Customer API Monitor
- **URL**: `https://your-customer-api.onrender.com/health`
- **Name**: ZENTHRA Customer API
- **Interval**: 5 minutes
- **Type**: HTTP(s)
- **Expected Response**: 200 OK with JSON status

### Admin API Monitor  
- **URL**: `https://your-admin-api.onrender.com/health`
- **Name**: ZENTHRA Admin API
- **Interval**: 5 minutes
- **Type**: HTTP(s)
- **Expected Response**: 200 OK with JSON status

## Health Endpoint Response

Both endpoints return comprehensive health data:

```json
{
  "status": "OK",
  "message": "ZENTHRA API is running", 
  "timestamp": "2025-08-11T16:06:00.000Z",
  "uptime": 3600.123,
  "memory": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1024000
  },
  "version": "1.0.0"
}
```

## Error Handling

If any issues occur, the health endpoint returns:

```json
{
  "status": "ERROR",
  "message": "Health check failed",
  "error": "Specific error details"
}
```

## Optimizations for UptimeRobot

✅ **Enhanced Error Handling**: Comprehensive try-catch blocks prevent crashes
✅ **Detailed Health Data**: Memory usage, uptime, and timestamp for debugging
✅ **Fast Response**: Lightweight endpoint for quick 5-minute pings
✅ **Proper Status Codes**: 200 for success, 500 for errors
✅ **TypeScript Safety**: Proper error typing to prevent runtime issues

## Alert Configuration Recommended

- **Response Time Alert**: > 30 seconds
- **Downtime Alert**: Immediate notification
- **Recovery Alert**: Automatic notification when back online
- **Contact Methods**: Email, SMS (optional), Slack/Discord

## Benefits

- **Proactive Monitoring**: Know about issues before users
- **Performance Tracking**: Monitor response times over time
- **Uptime Statistics**: Track reliability metrics
- **Automatic Recovery Detection**: Get notified when services recover

Both services are now fully optimized for reliable 5-minute monitoring with zero expected errors.