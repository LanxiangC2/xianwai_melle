export function watchBarrierAndUnitColide() {
    this.physics.collide(
        this.units,
        this.barriers,
        (barrier, unit) => {
            // 获取单位当前的移动速度向量（x 和 y 方向的速度分量）
            const velocityX = unit.body.velocity.x;
            const velocityY = unit.body.velocity.y;


            unit.isBypassingBarrier = true; // 设置标志位
            unit.collidedBarrier = barrier; // 记录碰撞到的路障

            // 如果单位在水平方向有速度（正在水平移动）
            // if (Math.abs(velocityX) > 0) {
            //     // 尝试向上移动绕过路障
            //     unit.setVelocity(0, 50);
            // } else if (Math.abs(velocityY) > 0) {
            //     // 如果在垂直方向有速度，尝试水平移动绕过路障（这里简单示例，可优化）
            //     unit.setVelocity(50, 0);
            // }

        }
    );
}

export function watchUnitAndUnitColide () {
    this.physics.collide(
        this.units,
        this.units,
        (unitA, unitB) => handleUnitCollision(unitA, unitB),
    );
}


function handleUnitCollision(unit1, unit2) {

    // 计算两个精灵之间的距离
    const distance = Phaser.Math.Distance.Between(unit1.x, unit1.y, unit2.x, unit2.y);

    // 如果距离小于最小间隔距离，进行位置调整
    if (distance < 5) {
        // 计算两个精灵的相对位置方向向量
        const dx = unit2.x - unit1.x;
        const dy = unit2.y - unit1.y;
        const distanceVec = Math.sqrt(dx * dx + dy * dy);

        // 归一化方向向量，使其长度为 1
        const dirX = dx / distanceVec;
        const dirY = dy / distanceVec;

        // 根据最小间隔距离和方向向量计算需要推开的距离
        const pushDistance = this.minOverlapDistance - distance;

        // 将两个精灵往相反方向推开合适的距离
        unit1.x -= dirX * pushDistance / 2;
        unit1.y -= dirY * pushDistance / 2;
        unit2.x += dirX * pushDistance / 2;
        unit2.y += dirY * pushDistance / 2;
    }
}


export function passingBarrier(unit) {
    const { collidedBarrier } = unit;
    if (!collidedBarrier) return;

    // 计算路障的边界
    const rightBoundry = collidedBarrier.x + collidedBarrier.width / 2;
    const leftBoundry = collidedBarrier.x - collidedBarrier.width / 2;
    
    // 计算单位与路障的水平距离
    const distanceToLeft = Math.abs(unit.x - leftBoundry);
    const distanceToRight = Math.abs(unit.x - rightBoundry);
    
    // 如果单位在路障左侧
    if (unit.x < collidedBarrier.x) {
        // 如果距离左侧边界较近，向左移动
        if (distanceToLeft < distanceToRight) {
            unit.setVelocity(-50, 0);
        } else {
            // 否则向右移动
            unit.setVelocity(50, 0);
        }
    } 
    // 如果单位在路障右侧
    else if (unit.x > collidedBarrier.x) {
        // 如果距离右侧边界较近，向右移动
        if (distanceToRight < distanceToLeft) {
            unit.setVelocity(50, 0);
        } else {
            // 否则向左移动
            unit.setVelocity(-50, 0);
        }
    }
    // 如果单位正好在路障中心
    else {
        // 随机选择一个方向移动
        unit.setVelocity(Math.random() > 0.5 ? 50 : -50, 0);
    }

    // 检查是否已经完全绕过路障
    const isBeyondBarrier = unit.x < leftBoundry - unit.width || unit.x > rightBoundry + unit.width;
    if (isBeyondBarrier) {
        unit.isBypassingBarrier = false;
    }
}