# 🚀 八字API调用完整指南

## 📍 API基础信息

**API地址**: `https://baziapi.site`

**API文档**: `https://baziapi.site/docs`

**认证方式**: 无需认证（公开API）

---

## 🎯 异步模式调用（推荐）

异步模式适合处理时间较长的请求，避免超时问题。

### 工作流程

```
1. 提交任务 → 立即返回 taskId
2. 轮询查询 → 检查任务状态
3. 获取结果 → 任务完成后获取完整数据
```

---

## 📝 JavaScript/TypeScript 调用示例

### 方法1：完整的异步调用类

```javascript
class BaziAPIClient {
    constructor(baseURL = 'https://baziapi.site') {
        this.baseURL = baseURL;
    }
    
    /**
     * 提交八字分析任务
     * @param {Object} data - 出生信息
     * @returns {Promise<string>} taskId
     */
    async submitTask(data) {
        const response = await fetch(`${this.baseURL}/api/bazi/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year: data.year,
                month: data.month,
                day: data.day,
                hour: data.hour,
                minute: data.minute || 0,
                gender: data.gender
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        return result.taskId;
    }
    
    /**
     * 查询任务状态
     * @param {string} taskId - 任务ID
     * @returns {Promise<Object>} 任务状态和结果
     */
    async getTaskResult(taskId) {
        const response = await fetch(`${this.baseURL}/api/bazi/result/${taskId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    /**
     * 轮询等待任务完成
     * @param {string} taskId - 任务ID
     * @param {number} maxAttempts - 最大尝试次数
     * @param {number} interval - 轮询间隔（毫秒）
     * @returns {Promise<Object>} 分析结果
     */
    async pollResult(taskId, maxAttempts = 60, interval = 2000) {
        for (let i = 0; i < maxAttempts; i++) {
            const result = await this.getTaskResult(taskId);
            
            if (result.status === 'completed') {
                return result.data;
            } else if (result.status === 'failed') {
                throw new Error(result.error || '分析失败');
            }
            
            // 等待后继续查询
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        throw new Error('任务超时');
    }
    
    /**
     * 一键分析（提交+轮询）
     * @param {Object} data - 出生信息
     * @returns {Promise<Object>} 分析结果
     */
    async analyze(data) {
        const taskId = await this.submitTask(data);
        return await this.pollResult(taskId);
    }
}

// 使用示例
const client = new BaziAPIClient();

// 方式1：一键分析
client.analyze({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: 'male'
}).then(result => {
    console.log('八字分析结果:', result);
}).catch(error => {
    console.error('分析失败:', error);
});

// 方式2：分步调用
async function analyzeBazi() {
    try {
        // 1. 提交任务
        const taskId = await client.submitTask({
            year: 1990,
            month: 1,
            day: 1,
            hour: 12,
            minute: 0,
            gender: 'male'
        });
        console.log('任务已提交:', taskId);
        
        // 2. 轮询结果
        const result = await client.pollResult(taskId);
        console.log('分析完成:', result);
        
        return result;
    } catch (error) {
        console.error('错误:', error);
    }
}
```

---

### 方法2：简化版（适合快速集成）

```javascript
async function analyzeBazi(birthData) {
    const API_BASE = 'https://baziapi.site';
    
    // 1. 提交任务
    const submitRes = await fetch(`${API_BASE}/api/bazi/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData)
    });
    const { taskId } = await submitRes.json();
    
    // 2. 轮询结果
    while (true) {
        const resultRes = await fetch(`${API_BASE}/api/bazi/result/${taskId}`);
        const result = await resultRes.json();
        
        if (result.status === 'completed') {
            return result.data;
        } else if (result.status === 'failed') {
            throw new Error(result.error);
        }
        
        // 等待2秒后继续查询
        await new Promise(r => setTimeout(r, 2000));
    }
}

// 使用
analyzeBazi({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: 'male'
}).then(result => {
    console.log(result);
});
```

---

## 🐍 Python 调用示例

### 方法1：使用 requests 库

```python
import requests
import time

class BaziAPIClient:
    def __init__(self, base_url='https://baziapi.site'):
        self.base_url = base_url
    
    def submit_task(self, data):
        """提交八字分析任务"""
        response = requests.post(
            f'{self.base_url}/api/bazi/submit',
            json=data
        )
        response.raise_for_status()
        return response.json()['taskId']
    
    def get_task_result(self, task_id):
        """查询任务结果"""
        response = requests.get(
            f'{self.base_url}/api/bazi/result/{task_id}'
        )
        response.raise_for_status()
        return response.json()
    
    def poll_result(self, task_id, max_attempts=60, interval=2):
        """轮询等待任务完成"""
        for i in range(max_attempts):
            result = self.get_task_result(task_id)
            
            if result['status'] == 'completed':
                return result['data']
            elif result['status'] == 'failed':
                raise Exception(result.get('error', '分析失败'))
            
            time.sleep(interval)
        
        raise Exception('任务超时')
    
    def analyze(self, data):
        """一键分析"""
        task_id = self.submit_task(data)
        return self.poll_result(task_id)

# 使用示例
client = BaziAPIClient()

result = client.analyze({
    'year': 1990,
    'month': 1,
    'day': 1,
    'hour': 12,
    'minute': 0,
    'gender': 'male'
})

print('八字分析结果:', result)
```

### 方法2：简化版

```python
import requests
import time

def analyze_bazi(birth_data):
    API_BASE = 'https://baziapi.site'
    
    # 1. 提交任务
    response = requests.post(
        f'{API_BASE}/api/bazi/submit',
        json=birth_data
    )
    task_id = response.json()['taskId']
    
    # 2. 轮询结果
    while True:
        response = requests.get(
            f'{API_BASE}/api/bazi/result/{task_id}'
        )
        result = response.json()
        
        if result['status'] == 'completed':
            return result['data']
        elif result['status'] == 'failed':
            raise Exception(result['error'])
        
        time.sleep(2)

# 使用
result = analyze_bazi({
    'year': 1990,
    'month': 1,
    'day': 1,
    'hour': 12,
    'minute': 0,
    'gender': 'male'
})
print(result)
```

---

## ☕ Java 调用示例

```java
import java.net.http.*;
import java.net.URI;
import com.google.gson.*;

public class BaziAPIClient {
    private final String baseURL;
    private final HttpClient client;
    private final Gson gson;
    
    public BaziAPIClient(String baseURL) {
        this.baseURL = baseURL;
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    public String submitTask(BirthData data) throws Exception {
        String json = gson.toJson(data);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseURL + "/api/bazi/submit"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
        
        HttpResponse<String> response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        JsonObject result = gson.fromJson(response.body(), JsonObject.class);
        return result.get("taskId").getAsString();
    }
    
    public JsonObject getTaskResult(String taskId) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseURL + "/api/bazi/result/" + taskId))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public JsonObject analyze(BirthData data) throws Exception {
        String taskId = submitTask(data);
        
        for (int i = 0; i < 60; i++) {
            JsonObject result = getTaskResult(taskId);
            String status = result.get("status").getAsString();
            
            if ("completed".equals(status)) {
                return result.getAsJsonObject("data");
            } else if ("failed".equals(status)) {
                throw new Exception(result.get("error").getAsString());
            }
            
            Thread.sleep(2000);
        }
        
        throw new Exception("任务超时");
    }
}

// 数据类
class BirthData {
    int year;
    int month;
    int day;
    int hour;
    int minute;
    String gender;
}

// 使用
BaziAPIClient client = new BaziAPIClient("https://baziapi.site");
BirthData data = new BirthData();
data.year = 1990;
data.month = 1;
data.day = 1;
data.hour = 12;
data.minute = 0;
data.gender = "male";

JsonObject result = client.analyze(data);
System.out.println(result);
```

---

## 🔧 PHP 调用示例

```php
<?php

class BaziAPIClient {
    private $baseURL;
    
    public function __construct($baseURL = 'https://baziapi.site') {
        $this->baseURL = $baseURL;
    }
    
    public function submitTask($data) {
        $ch = curl_init($this->baseURL . '/api/bazi/submit');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        return $result['taskId'];
    }
    
    public function getTaskResult($taskId) {
        $ch = curl_init($this->baseURL . '/api/bazi/result/' . $taskId);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function analyze($data) {
        $taskId = $this->submitTask($data);
        
        for ($i = 0; $i < 60; $i++) {
            $result = $this->getTaskResult($taskId);
            
            if ($result['status'] === 'completed') {
                return $result['data'];
            } elseif ($result['status'] === 'failed') {
                throw new Exception($result['error']);
            }
            
            sleep(2);
        }
        
        throw new Exception('任务超时');
    }
}

// 使用
$client = new BaziAPIClient();

$result = $client->analyze([
    'year' => 1990,
    'month' => 1,
    'day' => 1,
    'hour' => 12,
    'minute' => 0,
    'gender' => 'male'
]);

print_r($result);
?>
```

---

## 🌐 cURL 命令行调用

```bash
# 1. 提交任务
TASK_ID=$(curl -X POST https://baziapi.site/api/bazi/submit \
  -H "Content-Type: application/json" \
  -d '{"year":1990,"month":1,"day":1,"hour":12,"minute":0,"gender":"male"}' \
  | jq -r '.taskId')

echo "任务ID: $TASK_ID"

# 2. 查询结果（重复执行直到完成）
curl https://baziapi.site/api/bazi/result/$TASK_ID | jq
```

---

## 📊 API接口详情

### 1. 提交任务

**接口**: `POST /api/bazi/submit`

**请求参数**:
```json
{
  "year": 1990,      // 出生年份（必填）
  "month": 1,        // 出生月份 1-12（必填）
  "day": 1,          // 出生日期 1-31（必填）
  "hour": 12,        // 出生时辰 0-23（必填）
  "minute": 0,       // 出生分钟 0-59（可选，默认0）
  "gender": "male"   // 性别 male/female（必填）
}
```

**返回结果**:
```json
{
  "taskId": "uuid-string",
  "status": "processing",
  "message": "任务已提交，请使用 taskId 查询结果"
}
```

---

### 2. 查询结果

**接口**: `GET /api/bazi/result/{taskId}`

**返回结果（处理中）**:
```json
{
  "taskId": "uuid-string",
  "status": "processing"
}
```

**返回结果（已完成）**:
```json
{
  "taskId": "uuid-string",
  "status": "completed",
  "success": true,
  "data": {
    // 完整的八字分析结果
  }
}
```

**返回结果（失败）**:
```json
{
  "taskId": "uuid-string",
  "status": "failed",
  "success": false,
  "error": "错误信息"
}
```

---

## ⚙️ 最佳实践

### 1. 错误处理

```javascript
try {
    const result = await client.analyze(data);
    // 处理成功结果
} catch (error) {
    if (error.message.includes('timeout')) {
        // 处理超时
    } else if (error.message.includes('HTTP')) {
        // 处理HTTP错误
    } else {
        // 处理其他错误
    }
}
```

### 2. 轮询间隔

- **推荐间隔**: 2秒
- **最大尝试次数**: 60次（总共2分钟）
- **预期完成时间**: 30-60秒

### 3. 超时设置

```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 120000); // 120秒超时

fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timeout));
```

---

## 🔍 调试技巧

### 1. 查看API文档

访问 `https://baziapi.site/docs` 可以直接在浏览器中测试API

### 2. 检查网络请求

在浏览器开发者工具的Network标签中查看请求详情

### 3. 查看响应状态

```javascript
console.log('HTTP状态:', response.status);
console.log('响应头:', response.headers);
console.log('响应体:', await response.json());
```

---

## 📞 需要帮助？

- **API文档**: https://baziapi.site/docs
- **健康检查**: https://baziapi.site/health
- **测试页面**: https://xiaoj1-.github.io/bazi-ceshi-wangye/

---

## 🎉 快速开始

最简单的调用方式（JavaScript）：

```javascript
fetch('https://baziapi.site/api/bazi/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        year: 1990, month: 1, day: 1,
        hour: 12, minute: 0, gender: 'male'
    })
})
.then(r => r.json())
.then(data => console.log('任务ID:', data.taskId));
```

**就这么简单！** 🚀
