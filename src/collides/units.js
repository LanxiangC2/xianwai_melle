

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
    // collidedBarrier.x  是中心点位置
    const rightBoundry = collidedBarrier.x + collidedBarrier.width / 2;
    const leftBoundry = collidedBarrier.x - collidedBarrier.width / 2;
    if (!collidedBarrier) return
    // 根据单位与路障的相对位置确定绕过方向
    if (unit.x < collidedBarrier.x && unit.x > (leftBoundry - unit.width)) {
        // 单位在路障左侧，尝试向左移动
        unit.setVelocity(-50, 0);
    } else if (unit.x > collidedBarrier.x && unit.x < (rightBoundry + unit.width)) {
        // 单位在路障右侧，尝试向左移动
        unit.setVelocity(+50, 0);
    } 
    else {
        unit.isBypassingBarrier = false;
    }
}